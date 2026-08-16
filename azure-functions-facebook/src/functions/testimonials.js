const { app } = require('@azure/functions');
const axios = require('axios');

const FACEBOOK_GRAPH_VERSION = 'v21.0';

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
                        const reviewsUrl = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/${pageId}/ratings?access_token=${accessToken}&fields=review_text,reviewer,rating,created_time&limit=20`;

                        const response = await axios.get(reviewsUrl);
                        if (response.status >= 200 && response.status < 300) {
                            const data = response.data;

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
                        }
                    } else {
                        context.log('Facebook credentials not configured');
                    }
                } catch (fbError) {
                    context.error('Error fetching Facebook reviews:', fbError);
                    // Don't fail the request if Facebook is down
                }

                // Combine all testimonials
                // NOTE: submitted-via-website testimonials are not merged in here — there is
                // currently no persistence layer (see repo issue tracking this). New submissions
                // via POST below are validated and logged but not stored anywhere yet.
                const allTestimonials = [
                    ...defaultTestimonials,
                    ...facebookTestimonials
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
                    id: Date.now(),
                    quote: quote.trim(),
                    name: name.trim(),
                    location: location ? location.trim() : '',
                    source: 'Website',
                    submitted: new Date().toISOString(),
                    approved: false // Requires manual approval
                };

                context.log('New testimonial:', newTestimonial);

                // TODO: Store in database (Azure Table Storage, Cosmos DB, etc.) — tracked
                // separately. Until then, submissions are logged only and not retrievable.

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
            context.error('Error in testimonials function:', error);

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
