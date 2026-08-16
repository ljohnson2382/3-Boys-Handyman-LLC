// 3 Boys Handyman LLC / Healthy Homes - Azure Functions entry point
//
// Individual functions live in src/functions/. They must be require()'d here so the
// Azure Functions v4 runtime registers them — package.json's "main" only points at this
// file, so anything under src/functions/ that isn't required from here never loads.
//
// Facebook/testimonials functions live separately in ../azure-functions-facebook, deployed
// to the standalone func-healthyhomes-website-prod Function App instead of here — this SWA's
// managed-Functions sandbox gave no usable logs to debug them, and doesn't support timer
// triggers at all (auto-sync-facebook needs one).

require('./src/functions/health.js');
require('./src/functions/request-quote.js');
require('./src/functions/contact-form.js');

const { app } = require('@azure/functions');
module.exports = { app };
