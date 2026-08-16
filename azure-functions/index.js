// 3 Boys Handyman LLC - Azure Functions
// Construction business functionality: quotes, project management, customer communication

const { app } = require('@azure/functions');
const { EmailClient } = require('@azure/communication-email');

// Simple health check function
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

// Quote request handler - Creates Zoho Project for construction quotes
app.http('request-quote', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request, context) => {
    try {
      const quoteData = await request.json();
      
      context.log('Construction quote request received:', {
        customer: quoteData.customerName,
        project: quoteData.projectType,
        location: quoteData.address,
        timestamp: new Date().toISOString()
      });

      // Validate required fields for construction quotes
      const requiredFields = ['customerName', 'email', 'phone', 'address', 'projectType', 'projectDetails'];
      const missingFields = requiredFields.filter(field => !quoteData[field]);
      
      if (missingFields.length > 0) {
        return {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields',
            missingFields: missingFields
          })
        };
      }

      // Create Zoho Project for this construction job
      const zohoResult = await createZohoProject(quoteData, context);
      
      // Send confirmation email to customer
      const emailResult = await sendQuoteConfirmation(quoteData, zohoResult, context);
      
      // Notify 3-Boys-Handyman team
      await notifyTeam(quoteData, zohoResult, context);

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Quote request submitted successfully',
          projectId: zohoResult.projectId,
          estimatedResponse: '24-48 hours',
          nextSteps: [
            'Our team will review your project requirements',
            'We will schedule an on-site consultation',
            'You will receive a detailed quote within 48 hours'
          ],
          timestamp: new Date().toISOString()
        })
      };

    } catch (error) {
      context.log.error('❌ Error processing quote request:', error);
      
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Failed to process quote request. Please try again or call us directly.'
        })
      };
    }
  }
});

// Contact form submission handler
app.http('contact-form', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: corsHeaders
            };
        }

        try {
            context.log('Contact form submission received');
            
            const formData = await request.json();
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'projectDetails'];
            const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].toString().trim());
            
            if (missingFields.length > 0) {
                context.log('Validation failed - missing fields:', missingFields);
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    body: JSON.stringify({
                        success: false,
                        message: `Missing required fields: ${missingFields.join(', ')}`,
                        errors: missingFields
                    })
                };
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid email address format'
                    })
                };
            }

            // Phone validation (10 digits)
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid phone number - must be 10 digits'
                    })
                };
            }

            // Log the successful submission
            context.log('Contact form submission processed successfully:', {
                customer: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                timestamp: new Date().toISOString()
            });

            // Send email notification using Azure Communication Services
            try {
                const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
                
                if (connectionString) {
                    const emailClient = new EmailClient(connectionString);

                    const emailContent = `
New Contact Form Submission from Healthy Homes Website:

Customer Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Service Requested: ${formData.service}

Project Details:
${formData.projectDetails}

Submitted: ${new Date().toLocaleString()}
Submission ID: CONTACT-${Date.now()}
                    `.trim();

                    const emailMessage = {
                        senderAddress: process.env.SENDER_EMAIL || 'noreply@homefixandbuild.org',
                        content: {
                            subject: `🏠 New Contact: ${formData.firstName} ${formData.lastName} - ${formData.service}`,
                            plainText: emailContent,
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                                    <h2 style="color: #152437;">New Contact Form Submission</h2>
                                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                        <h3 style="color: #4a90e2; margin-top: 0;">Customer Information</h3>
                                        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
                                        <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                                        <p><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
                                        <p><strong>Service:</strong> ${formData.service}</p>
                                    </div>
                                    <div style="background: #fff; padding: 20px; border-left: 4px solid #4a90e2;">
                                        <h3 style="color: #4a90e2; margin-top: 0;">Project Details</h3>
                                        <p style="white-space: pre-wrap;">${formData.projectDetails}</p>
                                    </div>
                                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                                        Submitted: ${new Date().toLocaleString()}<br>
                                        Submission ID: CONTACT-${Date.now()}
                                    </p>
                                </div>
                            `
                        },
                        recipients: {
                            to: [{ address: 'info@homefixandbuild.org' }]
                        }
                    };

                    // Send the email
                    const poller = await emailClient.beginSend(emailMessage);
                    const result = await poller.pollUntilDone();
                    
                    context.log('Email sent successfully via Azure Communication Services:', {
                        messageId: result.id,
                        to: 'info@homefixandbuild.org',
                        subject: emailMessage.content.subject
                    });
                } else {
                    context.log('Azure Communication Services not configured, logging email content:', {
                        to: 'info@homefixandbuild.org',
                        subject: `New Contact: ${formData.firstName} ${formData.lastName} - ${formData.service}`,
                        customer: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone,
                        service: formData.service
                    });
                }

            } catch (emailError) {
                context.log('Email sending failed:', emailError.message);
                // Don't fail the form submission if email fails - we'll still log the submission
            }

            // Return success response
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Thank you for your inquiry! We will contact you within 24 hours.',
                    submissionId: `CONTACT-${Date.now()}`
                })
            };

        } catch (error) {
            context.log('Contact form submission error:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                },
                body: JSON.stringify({
                    success: false,
                    message: 'There was an error processing your form. Please try again or call us directly at (857) 207-2145.'
                })
            };
        }
    }
});

// ==============================================
// ZOHO PROJECTS INTEGRATION FUNCTIONS
// ==============================================

async function createZohoProject(quoteData, context) {
  try {
    // Mock response for now - will integrate with actual Zoho Projects API
    const projectId = `PROJECT-${Date.now()}`;
    
    context.log('🏗️ Creating Zoho Project for construction quote:', {
      customer: quoteData.customerName,
      projectType: quoteData.projectType,
      projectId: projectId
    });

    // TODO: Implement actual Zoho Projects API integration
    // const zohoProjectsAPI = new ZohoProjectsClient();
    // const project = await zohoProjectsAPI.createProject({
    //   name: `${quoteData.projectType} - ${quoteData.customerName}`,
    //   description: quoteData.projectDetails,
    //   customer: quoteData.customerName,
    //   address: quoteData.address,
    //   budget: quoteData.estimatedBudget,
    //   timeline: quoteData.timeframe
    // });

    return {
      success: true,
      projectId: projectId,
      projectName: `${quoteData.projectType} - ${quoteData.customerName}`,
      status: 'Quote Requested'
    };

  } catch (error) {
    context.log.error('❌ Failed to create Zoho Project:', error);
    
    return {
      success: false,
      error: error.message,
      projectId: `FALLBACK-${Date.now()}`
    };
  }
}

async function sendQuoteConfirmation(quoteData, zohoResult, context) {
  try {
    const emailContent = {
      to: quoteData.email,
      from: 'quotes@homefixandbuild.org',
      subject: `Quote Request Received - ${quoteData.projectType}`,
      html: generateQuoteConfirmationEmail(quoteData, zohoResult)
    };

    context.log('📧 Sending quote confirmation to customer:', quoteData.email);

    // TODO: Integrate with email service (SendGrid, Azure Communication Services, etc.)
    // await sendEmail(emailContent);

    return {
      success: true,
      emailSent: true,
      recipient: quoteData.email
    };

  } catch (error) {
    context.log.error('❌ Failed to send quote confirmation:', error);
    return { success: false, error: error.message };
  }
}

async function notifyTeam(quoteData, zohoResult, context) {
  try {
    const teamEmail = {
      to: 'team@homefixandbuild.org',
      from: 'system@homefixandbuild.org', 
      subject: `🔨 New Quote Request: ${quoteData.projectType}`,
      html: generateTeamNotificationEmail(quoteData, zohoResult)
    };

    context.log('📧 Notifying 3-Boys-Handyman team of new quote request');

    // TODO: Send team notification email
    // await sendEmail(teamEmail);

    return { success: true };

  } catch (error) {
    context.log.error('❌ Failed to notify team:', error);
    return { success: false, error: error.message };
  }
}

async function sendGeneralInquiry(formData, context) {
  try {
    context.log('📧 Processing general inquiry for team');

    // TODO: Send general inquiry to team email
    // const inquiryEmail = {
    //   to: 'info@homefixandbuild.org',
    //   subject: `General Inquiry from ${formData.name}`,
    //   html: generateGeneralInquiryEmail(formData)
    // };

    return { success: true };

  } catch (error) {
    context.log.error('❌ Failed to send general inquiry:', error);
    return { success: false, error: error.message };
  }
}

// ==============================================
// EMAIL TEMPLATE FUNCTIONS
// ==============================================

function generateQuoteConfirmationEmail(quoteData, zohoResult) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Request Confirmation - 3 Boys Handyman LLC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #f39c12; margin: 0; font-size: 28px;">🔨 3 Boys Handyman LLC</h1>
        <h2 style="color: #ecf0f1; margin: 10px 0 0 0; font-weight: 300; font-size: 18px;">Quote Request Received</h2>
    </div>
    
    <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${quoteData.customerName},</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
            Thank you for requesting a quote for your <strong>${quoteData.projectType}</strong> project! 
            We have received your request and our team is already reviewing the details.
        </p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 25px 0;">
            <h3 style="color: #27ae60; margin-top: 0; font-size: 18px;">📋 Your Project Details:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Project Type:</strong> ${quoteData.projectType}</li>
                <li><strong>Location:</strong> ${quoteData.address}</li>
                <li><strong>Timeline:</strong> ${quoteData.timeframe || 'To be discussed'}</li>
                <li><strong>Budget Range:</strong> ${quoteData.estimatedBudget || 'To be determined'}</li>
                <li><strong>Project ID:</strong> ${zohoResult.projectId}</li>
            </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #f39c12; margin: 25px 0;">
            <h3 style="color: #856404; margin-top: 0; font-size: 18px;">⏰ What Happens Next:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;"><strong>Review:</strong> Our team reviews your project requirements</li>
                <li style="margin-bottom: 10px;"><strong>Site Visit:</strong> We schedule a consultation at your location</li>
                <li style="margin-bottom: 10px;"><strong>Quote:</strong> You receive a detailed quote within 24-48 hours</li>
                <li style="margin-bottom: 10px;"><strong>Discussion:</strong> We discuss the quote and answer any questions</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; margin-bottom: 15px;"><strong>Questions about your quote?</strong></p>
            <p style="font-size: 16px; margin-bottom: 10px;">📞 Call us: <strong>(555) 123-4567</strong></p>
            <p style="font-size: 16px;">📧 Email us: <strong>quotes@homefixandbuild.org</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <div style="color: #6c757d; font-size: 12px;">
                <strong>3 Boys Handyman LLC</strong><br>
                Professional Construction & Renovation Services<br>
                Licensed • Bonded • Insured
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

function generateTeamNotificationEmail(quoteData, zohoResult) {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px;">
    <h2>🔨 New Quote Request</h2>
    
    <h3>Customer Information:</h3>
    <ul>
        <li><strong>Name:</strong> ${quoteData.customerName}</li>
        <li><strong>Email:</strong> ${quoteData.email}</li>
        <li><strong>Phone:</strong> ${quoteData.phone}</li>
        <li><strong>Address:</strong> ${quoteData.address}</li>
    </ul>
    
    <h3>Project Details:</h3>
    <ul>
        <li><strong>Type:</strong> ${quoteData.projectType}</li>
        <li><strong>Timeline:</strong> ${quoteData.timeframe || 'Not specified'}</li>
        <li><strong>Budget:</strong> ${quoteData.estimatedBudget || 'Not specified'}</li>
        <li><strong>Details:</strong> ${quoteData.projectDetails}</li>
    </ul>
    
    <h3>System Info:</h3>
    <ul>
        <li><strong>Project ID:</strong> ${zohoResult.projectId}</li>
        <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    
    <p><strong>Action Required:</strong> Schedule site consultation and prepare quote.</p>
</div>
  `;
}

// ==============================================
// TESTIMONIALS WITH FACEBOOK INTEGRATION
// ==============================================

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
                        context.log('🔍 Fetching live Facebook reviews...');
                        const reviewsUrl = `https://graph.facebook.com/v18.0/${pageId}/ratings?access_token=${accessToken}&fields=review_text,reviewer,rating,created_time&limit=20`;
                        
                        const response = await fetch(reviewsUrl);
                        if (response.ok) {
                            const data = await response.json();
                            context.log('📱 Facebook API response:', JSON.stringify(data, null, 2));
                            
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
                            context.log.warn('⚠️ Failed to fetch Facebook reviews:', response.status);
                        }
                    } else {
                        context.log('⚠️ Facebook credentials not configured');
                    }
                } catch (fbError) {
                    context.log.error('❌ Error fetching Facebook reviews:', fbError);
                }
                
                // Combine all testimonials
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

module.exports = { app };