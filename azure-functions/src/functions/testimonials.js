const { app } = require('@azure/functions');

app.http('testimonials', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        try {
            if (request.method === 'GET') {
                // GET: Fetch all approved testimonials (including Facebook reviews)
                context.log('Fetching testimonials including Facebook reviews');
                
                // Static testimonials
                const defaultTestimonials = [
                    { 
                        quote: "They did an amazing job on my kitchen remodel! Professional, timely, and exceeded expectations.", 
                        name: "Sarah M.", 
                        location: "Somerville, MA",
                        source: "Website",
                        approved: true,
                        id: 1 
                    },
                    { 
                        quote: "Reliable and skilled — I'll definitely hire them again. Great communication throughout the project.", 
                        name: "David R.", 
                        location: "Waltham, MA",
                        source: "Website",
                        approved: true,
                        id: 2 
                    },
                    { 
                        quote: "Outstanding deck construction! The team was professional and finished ahead of schedule.", 
                        name: "Michael K.", 
                        location: "Manchester, NH",
                        source: "Website",
                        approved: true,
                        id: 3 
                    }
                ];
                
                // Fetch fresh Facebook reviews
                let facebookTestimonials = [];
                try {
                    const pageId = process.env.FACEBOOK_PAGE_ID;
                    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
                    
                    if (pageId && accessToken) {
                        context.log('Fetching live Facebook reviews...');
                        const reviewsUrl = `https://graph.facebook.com/v18.0/${pageId}/ratings?access_token=${accessToken}&fields=review_text,reviewer,rating,created_time&limit=20`;
                        
                        const response = await fetch(reviewsUrl);
                        if (response.ok) {
                            const data = await response.json();
                            
                            facebookTestimonials = data.data
                                .filter(review => 
                                    review.review_text && 
                                    review.review_text.trim().length > 10 && 
                                    review.rating >= 4
                                )
                                .map(review => ({
                                    id: `fb_${review.reviewer.id}_${new Date(review.created_time).getTime()}`,
                                    quote: review.review_text.trim(),
                                    name: review.reviewer.name,
                                    location: '',
                                    source: 'Facebook',
                                    rating: review.rating,
                                    submitted: review.created_time,
                                    approved: true
                                }));
                                
                            context.log(`✅ Loaded ${facebookTestimonials.length} Facebook reviews`);
                        } else {
                            context.log.warn('Failed to fetch Facebook reviews:', response.status);
                        }
                    }
                } catch (fbError) {
                    context.log.error('Error fetching Facebook reviews:', fbError);
                    // Don't fail the request if Facebook is down
                }
                
                // Combine all testimonials
                const storedTestimonials = context.bindings?.testimonials || [];
                const allTestimonials = [
                    ...defaultTestimonials, 
                    ...facebookTestimonials,
                    ...storedTestimonials.filter(t => t.approved)
                ];
                
                // Sort by most recent first
                allTestimonials.sort((a, b) => new Date(b.submitted || 0) - new Date(a.submitted || 0));
                
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    body: JSON.stringify({
                        success: true,
                        testimonials: allTestimonials,
                        stats: {
                            total: allTestimonials.length,
                            facebook: facebookTestimonials.length,
                            website: allTestimonials.length - facebookTestimonials.length
                        }
                    })
                };
                
            } else if (request.method === 'POST') {
                // POST: Submit new testimonial
                context.log('New testimonial submission received');
                
                const { quote, name, location } = await request.json();
                
                // Validate required fields
                if (!quote || !name) {
                    return {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            ...corsHeaders
                        },
                        body: JSON.stringify({
                            success: false,
                            message: 'Quote and name are required'
                        })
                    };
                }
                
                // Create new testimonial object
                const newTestimonial = {
                    id: Date.now(), // Simple ID generation
                    quote: quote.trim(),
                    name: name.trim(),
                    location: location ? location.trim() : '',
                    submitted: new Date().toISOString(),
                    approved: false // Requires manual approval
                };
                
                context.log('New testimonial:', newTestimonial);
                
                // TODO: Store in database (Azure Table Storage, Cosmos DB, etc.)
                // For now, we'll just log it and send a notification email
                
                // Send notification email to admin
                try {
                    const adminNotification = `
New Testimonial Submission - Healthy Homes LLC

Customer: ${newTestimonial.name}
Location: ${newTestimonial.location}
Submitted: ${new Date(newTestimonial.submitted).toLocaleString()}

Testimonial:
"${newTestimonial.quote}"

---
To approve this testimonial, log into your admin panel or contact your developer.
                    `;
                    
                    context.log('Admin notification prepared:', adminNotification);
                    
                    // TODO: Send email to admin using Azure Communication Services
                    // await sendAdminEmail({
                    //     to: 'info@homefixandbuild.org',
                    //     subject: 'New Testimonial Awaiting Approval',
                    //     body: adminNotification
                    // });
                } catch (emailError) {
                    context.log.error('Failed to send admin notification:', emailError);
                }
                
                // Optional: Auto-post approved testimonials to Facebook
                try {
                    if (process.env.AUTO_POST_TO_FACEBOOK === 'true' && newTestimonial.approved) {
                        context.log('Auto-posting testimonial to Facebook...');
                        
                        const facebookResponse = await fetch('/api/post-testimonial-to-facebook', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'x-functions-key': process.env.FACEBOOK_SYNC_FUNCTION_KEY 
                            },
                            body: JSON.stringify({ testimonial: newTestimonial })
                        });
                        
                        if (facebookResponse.ok) {
                            context.log('Successfully posted to Facebook');
                        } else {
                            context.log.warn('Failed to post to Facebook:', await facebookResponse.text());
                        }
                    }
                } catch (facebookError) {
                    context.log.error('Facebook posting error:', facebookError);
                    // Don't fail the main request if Facebook posting fails
                }
                
                return {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    body: JSON.stringify({
                        success: true,
                        message: 'Thank you for your testimonial! It will be reviewed and published soon.',
                        testimonial: newTestimonial
                    })
                };
            }
            
        } catch (error) {
            context.log.error('Error in testimonials function:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Sorry, there was an error processing your request.'
                })
            };
        }
    }
});

// Handle preflight requests for CORS
app.http('testimonials-options', {
    methods: ['OPTIONS'],
    authLevel: 'anonymous',
    route: 'testimonials',
    handler: async (request, context) => {
        return {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }
});