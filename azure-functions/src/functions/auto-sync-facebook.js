const { app } = require('@azure/functions');

const FACEBOOK_GRAPH_VERSION = 'v21.0';

// Timer trigger that automatically syncs Facebook reviews every 4 hours
app.timer('auto-sync-facebook', {
    schedule: '0 0 */4 * * *', // Every 4 hours: 12:00 AM, 4:00 AM, 8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM
    handler: async (myTimer, context) => {
        context.log('🚀 Starting automatic Facebook review sync...');
        
        try {
            const pageId = process.env.FACEBOOK_PAGE_ID;
            const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
            
            if (!pageId || !accessToken) {
                context.log.error('❌ Facebook credentials not configured');
                return;
            }
            
            // Fetch Facebook reviews
            const reviewsUrl = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/${pageId}/ratings?access_token=${accessToken}&fields=review_text,reviewer,rating,created_time&limit=50`;
            context.log('📱 Fetching Facebook reviews...');
            
            const response = await fetch(reviewsUrl);
            const data = await response.json();
            
            if (!response.ok) {
                context.log.error('❌ Facebook API error:', data);
                return;
            }
            
            // Filter for good reviews with text (4-5 stars)
            const goodReviews = data.data
                .filter(review => 
                    review.review_text && 
                    review.review_text.trim().length > 10 && 
                    review.rating >= 4
                )
                .map(review => ({
                    id: `facebook_${review.reviewer.id}_${new Date(review.created_time).getTime()}`,
                    quote: review.review_text.trim(),
                    name: review.reviewer.name,
                    location: '', 
                    rating: review.rating,
                    source: 'Facebook',
                    submitted: review.created_time,
                    approved: true, // Auto-approve Facebook reviews
                    autoSynced: true
                }));
            
            context.log(`✅ Found ${goodReviews.length} quality Facebook reviews to sync`);
            
            if (goodReviews.length > 0) {
                // TODO: In production, save these to your testimonials database
                // For now, just log the success
                context.log('📝 Reviews ready for testimonials database:', goodReviews.map(r => ({
                    name: r.name,
                    rating: r.rating,
                    preview: r.quote.substring(0, 50) + '...'
                })));
            }
            
            return {
                status: 'success',
                reviewsSynced: goodReviews.length,
                timestamp: new Date().toISOString(),
                nextRun: 'In 4 hours'
            };
            
        } catch (error) {
            context.log.error('❌ Auto-sync failed:', error);
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
});