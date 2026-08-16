// TEST FUNCTIONS - Customer Pipeline for func-healthyhomes-pipeline
// Safe testing version - no real deployments or emails

const { app } = require('@azure/functions');

// TEST: Customer notification when staging deploys
app.http('test-staging-deployed', {
    methods: ['POST', 'GET'], // GET for browser testing
    authLevel: 'function',
    handler: async (request, context) => {
        try {
            const isTestMode = process.env.TEST_MODE === 'true' || request.query.test === 'true';
            
            let payload;
            if (request.method === 'GET') {
                // Browser test with mock data
                payload = {
                    repository: 'ljohnson2382/3-Boys-Handyman-LLC',
                    commit_sha: 'test-sha-123',
                    commit_message: 'Test deployment for pipeline validation',
                    staging_url: 'https://staging.homefixandbuild.org',
                    author: 'Test User',
                    test_mode: true
                };
                context.log('🌐 Browser test accessed with mock data');
            } else {
                payload = await request.json();
            }
            
            context.log('🧪 TEST: Staging deployment notification received:', payload);
            
            // Mock customer email template
            const mockEmail = {
                to: isTestMode ? 'test-customer@example.com' : 'customer@3boyslawton.com',
                from: 'noreply@homefixandbuild.org',
                subject: `${isTestMode ? '[TEST] ' : ''}🚀 3 Boys Handyman - New Website Updates Ready for Review`,
                html: generateCustomerEmailHTML(payload, isTestMode),
                test_mode: isTestMode
            };
            
            context.log('📧 Would send customer email:', mockEmail);
            
            // Mock Teams/Slack notification
            const mockTeamsMessage = {
                title: '🚀 Customer Review Required',
                text: `New staging deployment ready for customer approval`,
                staging_url: payload.staging_url,
                test_mode: isTestMode
            };
            
            context.log('💬 Would post to Teams:', mockTeamsMessage);
            
            return { 
                status: 200, 
                jsonBody: { 
                    message: isTestMode ? 'TEST: Customer notification mock successful' : 'Customer notification sent',
                    email_payload: mockEmail,
                    teams_payload: mockTeamsMessage,
                    staging_url: payload.staging_url,
                    test_mode: isTestMode,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            context.error('Test error:', error);
            return { 
                status: 500, 
                jsonBody: { error: error.message, test_mode: true }
            };
        }
    }
});

// TEST: Customer email response processing
app.http('test-email-processor', {
    methods: ['POST', 'GET'], // GET for browser testing
    authLevel: 'function',
    handler: async (request, context) => {
        try {
            const isTestMode = process.env.TEST_MODE === 'true' || request.query.test === 'true';
            
            let emailData;
            if (request.method === 'GET') {
                // Browser test with mock data
                const testType = request.query.type || 'approve'; // approve, reject, comment
                emailData = {
                    from: 'customer@3boyslawton.com',
                    subject: 'RE: [PR #123] 3 Boys Handyman - Website Updates',
                    body: getMockEmailBody(testType),
                    test_mode: true
                };
                context.log('🌐 Browser test accessed with mock email type:', testType);
            } else {
                emailData = await request.json();
            }
            
            context.log('🧪 TEST: Customer email response received:', emailData);
            
            // Mock PR processing logic
            const customerResponse = emailData.body || '';
            let action = 'unknown';
            
            if (customerResponse.toLowerCase().includes('approve') || customerResponse.includes('✅')) {
                action = 'approve';
            } else if (customerResponse.toLowerCase().includes('request changes') || customerResponse.includes('❌')) {
                action = 'request_changes';
            } else if (customerResponse.toLowerCase().includes('comment') || customerResponse.toLowerCase().includes('note')) {
                action = 'comment';
            }
            
            const mockResponse = {
                action: action,
                pr_number: extractPRNumber(emailData.subject) || 'TEST-123',
                customer_email: emailData.from,
                customer_response: customerResponse,
                would_perform: getActionDescription(action),
                github_api_calls: getMockGitHubCalls(action),
                test_mode: isTestMode,
                timestamp: new Date().toISOString()
            };
            
            context.log('🔄 Would perform GitHub actions:', mockResponse);
            
            return { 
                status: 200, 
                jsonBody: mockResponse
            };
        } catch (error) {
            context.error('Test email processing error:', error);
            return { 
                status: 500, 
                jsonBody: { error: error.message, test_mode: true }
            };
        }
    }
});

// Helper function to generate customer email HTML
function generateCustomerEmailHTML(payload, isTestMode = false) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0d1b2a; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #ff6b35;">3 Boys Handyman LLC</h1>
                <h2 style="margin: 10px 0 0 0;">${isTestMode ? '[TEST] ' : ''}Website Updates Ready for Review</h2>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
                ${isTestMode ? '<div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px;"><strong>🧪 TEST MODE:</strong> This is a test email - no real deployment actions will occur.</div>' : ''}
                
                <h3>🌐 Preview Your Changes</h3>
                <p>New changes deployed to staging:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${payload.staging_url}" 
                       style="background: #ff6b35; color: white; padding: 15px 30px; 
                              text-decoration: none; border-radius: 5px;">
                        👀 VIEW STAGING SITE
                    </a>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px;">
                    <strong>Changes:</strong> ${payload.commit_message}<br>
                    <strong>Author:</strong> ${payload.author}<br>
                    <strong>Commit:</strong> ${payload.commit_sha}
                </div>
                
                <h3>📧 How to Respond</h3>
                <p>Reply to this email with:</p>
                <div style="background: #e8f5e8; padding: 10px; margin: 5px 0;">✅ APPROVE - Deploy to production</div>
                <div style="background: #fff2e8; padding: 10px; margin: 5px 0;">❌ REQUEST CHANGES - Include feedback</div>
                <div style="background: #e8f2ff; padding: 10px; margin: 5px 0;">💬 COMMENT - Add notes</div>
                
                ${isTestMode ? '<div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px;"><strong>⚠️ Test Mode:</strong> Your response will be processed but no actual deployments will occur.</div>' : ''}
            </div>
        </div>
    `;
}

function getMockEmailBody(testType) {
    switch(testType) {
        case 'approve':
            return '✅ This looks great! Please deploy to production. APPROVED. The new updates look perfect and ready to go live.';
        case 'reject':
            return '❌ I need some changes before this goes live. REQUEST CHANGES. The color scheme needs adjustment and the contact form has issues.';
        case 'comment':
            return '💬 The overall look is good, but can we discuss a few minor tweaks? Let me know when you have time to chat about the layout.';
        default:
            return 'Thanks for the update. Let me review this and get back to you.';
    }
}

function extractPRNumber(subject) {
    const match = subject.match(/\[PR #(\d+)\]|\#(\d+)/);
    return match ? (match[1] || match[2]) : null;
}

function analyzeCustomerResponse(body) {
    const lowerBody = body.toLowerCase();
    if (lowerBody.includes('approve') || lowerBody.includes('✅') || lowerBody.includes('looks good')) {
        return true;
    }
    return false;
}

function generatePRComment(emailContent, isApproved, isTestMode = false) {
    const testPrefix = isTestMode ? '🧪 **TEST MODE** ' : '';
    const status = isApproved ? '✅ **APPROVED**' : '❌ **CHANGES REQUESTED**';
    
    return `${testPrefix}${status} by Customer

**Customer Response:**
> ${emailContent.body}

**From:** ${emailContent.from}
**Timestamp:** ${new Date().toISOString()}

${isApproved ? 
    '🚀 **Ready for Production Deployment**' : 
    '⏸️ **Deployment Held** - Please address customer feedback before proceeding'}`;
}

function getActionDescription(action) {
    switch(action) {
        case 'approve': return 'Auto-approve PR and deploy to production';
        case 'request_changes': return 'Add feedback comment and request changes on PR';
        case 'comment': return 'Add general comment to PR';
        default: return 'No action (unclear customer response)';
    }
}

function getMockGitHubCalls(action) {
    switch(action) {
        case 'approve':
            return [
                'POST /repos/ljohnson2382/3-Boys-Handyman-LLC/pulls/{pr_number}/reviews (APPROVE)',
                'PUT /repos/ljohnson2382/3-Boys-Handyman-LLC/pulls/{pr_number}/merge'
            ];
        case 'request_changes':
            return [
                'POST /repos/ljohnson2382/3-Boys-Handyman-LLC/pulls/{pr_number}/reviews (REQUEST_CHANGES)',
                'POST /repos/ljohnson2382/3-Boys-Handyman-LLC/issues/{pr_number}/comments'
            ];
        case 'comment':
            return [
                'POST /repos/ljohnson2382/3-Boys-Handyman-LLC/issues/{pr_number}/comments'
            ];
        default:
            return [];
    }
}