// Healthy Homes - Facebook / Testimonials Functions
//
// Deployed to the standalone func-healthyhomes-website-prod Function App rather than as a
// Static Web Apps managed API. These functions all make outbound calls to graph.facebook.com,
// which consistently 500'd with no diagnosable error under the SWA-managed sandbox (no logs
// available on Free tier to confirm whether that was a timeout or an egress restriction).
// A standalone Function App gives real Application Insights logs and — importantly — actually
// supports timer triggers, which SWA managed Functions do not (auto-sync-facebook's 4-hour
// schedule silently never ran there).

require('./src/functions/testimonials.js');
require('./src/functions/facebook-sync.js');
require('./src/functions/auto-sync-facebook.js');

const { app } = require('@azure/functions');
module.exports = { app };
