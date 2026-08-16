const { app } = require('@azure/functions');

app.http('sync-facebook-reviews', {
    methods: ['GET', 'POST'],
    authLevel: 'function', // Requires function key for security
    handler: async (request, context) => {
        try {
            const pageId = process.env.FACEBOOK_PAGE_ID; // Your Facebook Page ID
            const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
            
            if (!pageId || !accessToken) {
                return {
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: 'Facebook credentials not configured'
                    })
                };
            }
            
            // Fetch Facebook reviews
            const reviewsUrl = `https://graph.facebook.com/v18.0/${pageId}/ratings?access_token=${accessToken}&fields=review_text,reviewer,rating,created_time&limit=50`;
            
            context.log('Fetching Facebook reviews from:', reviewsUrl.replace(accessToken, '[TOKEN]'));
            
            const response = await fetch(reviewsUrl);
            const data = await response.json();
            
            if (!response.ok) {
                context.log.error('Facebook API error:', data);
                return {
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to fetch Facebook reviews',
                        error: data.error
                    })
                };
            }
            
            // Transform Facebook reviews to testimonial format
            const facebookTestimonials = data.data
                .filter(review => review.review_text && review.rating >= 4) // Only 4-5 star reviews with text
                .map(review => ({
                    id: `fb_${review.reviewer.id}`,
                    quote: review.review_text,
                    name: review.reviewer.name,
                    location: '', // Facebook doesn't provide location in reviews
                    rating: review.rating,
                    source: 'facebook',
                    submitted: review.created_time,
                    approved: true // Auto-approve Facebook reviews
                }));
            
            context.log(`Found ${facebookTestimonials.length} Facebook reviews to sync`);
            
            // TODO: Store in database and merge with existing testimonials
            // For now, just return them
            
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: `Synced ${facebookTestimonials.length} Facebook reviews`,
                    testimonials: facebookTestimonials
                })
            };
            
        } catch (error) {
            context.log.error('Error syncing Facebook reviews:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: 'Error syncing Facebook reviews',
                    error: error.message
                })
            };
        }
    }
});

// Function to post testimonial to Facebook page
app.http('post-testimonial-to-facebook', {
    methods: ['POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        try {
            const { testimonial } = await request.json();
            const pageId = process.env.FACEBOOK_PAGE_ID;
            const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
            
            if (!pageId || !accessToken) {
                return {
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: 'Facebook credentials not configured'
                    })
                };
            }
            
            // Create Facebook post content
            const postMessage = `🌟 Amazing feedback from ${testimonial.name}!\n\n"${testimonial.quote}"\n\n${testimonial.location ? `📍 ${testimonial.location}\n\n` : ''}Thank you for trusting Healthy Homes LLC with your project! 🏡✨\n\n#CustomerTestimonial #HealthyHomesLLC #QualityCraftsmanship`;
            
            // Post to Facebook page
            const postUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`;
            const postData = {
                message: postMessage,
                access_token: accessToken
            };
            
            const response = await fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                context.log.error('Facebook post error:', result);
                return {
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to post to Facebook',
                        error: result.error
                    })
                };
            }
            
            context.log('Successfully posted testimonial to Facebook:', result.id);
            
            return {
                status: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Testimonial posted to Facebook successfully',
                    postId: result.id
                })
            };
            
        } catch (error) {
            context.log.error('Error posting to Facebook:', error);
            return {
                status: 500,
                body: JSON.stringify({
                    success: false,
                    message: 'Error posting to Facebook',
                    error: error.message
                })
            };
        }
    }
});