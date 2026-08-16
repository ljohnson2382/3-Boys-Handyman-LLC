// 3 Boys Handyman LLC / Healthy Homes - Azure Functions entry point
//
// Individual functions live in src/functions/. They must be require()'d here so the
// Azure Functions v4 runtime registers them — package.json's "main" only points at this
// file, so anything under src/functions/ that isn't required from here never loads.

require('./src/functions/health.js');
require('./src/functions/request-quote.js');
require('./src/functions/contact-form.js');
require('./src/functions/testimonials.js');
require('./src/functions/facebook-sync.js');
require('./src/functions/auto-sync-facebook.js');

const { app } = require('@azure/functions');
module.exports = { app };
