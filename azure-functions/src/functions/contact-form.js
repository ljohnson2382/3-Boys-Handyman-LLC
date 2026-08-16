const { app } = require('@azure/functions');
const { EmailClient } = require('@azure/communication-email');

// Contact form submission handler
// NOTE: the live site's Contact page currently posts directly to Web3Forms client-side
// (see src/pages/Contact.jsx) and does not call this endpoint. Kept as a fallback/webhook
// target since it was already implemented and working when reachable.
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
