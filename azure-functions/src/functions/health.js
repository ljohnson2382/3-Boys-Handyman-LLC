const { app } = require('@azure/functions');

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Health check requested');

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'healthy',
        website: '3 Boys Handyman LLC',
        timestamp: new Date().toISOString(),
        message: 'Website functions are operational'
      })
    };
  }
});
