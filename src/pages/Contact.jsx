import { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    projectDetails: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone) => {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10;
  };
  
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.trim().length < 2) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'service':
        if (!value) {
          error = 'Please select a service';
        }
        break;
      case 'projectDetails':
        if (!value.trim()) {
          error = 'Project details are required';
        } else if (value.trim().length < 10) {
          error = 'Please provide more details about your project (at least 10 characters)';
        }
        break;
    }
    
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format phone number as user types
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    // Real-time validation
    const error = validateField(name, formattedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    // If there are validation errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `New Quote Request from ${formData.firstName} ${formData.lastName}`,
          from_name: `${formData.firstName} ${formData.lastName}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          project_details: formData.projectDetails,
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          projectDetails: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
  <div className="min-h-screen bg-lightGray">
    <SEO
      title="Contact Us"
      description="Get a free quote from Healthy Homes, LLC. Call (857) 207-2145 or send us your project details — professional home services in Manchester, New Hampshire."
      path="/contact"
    />
    {/* Hero Section */}
    <div className="relative h-64 md:h-80 bg-midGray overflow-hidden">
      <img 
        src="/images/contact-hero-exterior-landscaping.jpg" 
        alt="Professional landscaping and exterior services" 
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-navy bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">Ready to start your next project? Get in touch today!</p>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto py-16 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-navy mb-6">Get Your Free Quote</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              Sorry, there was an error sending your message. Please try again or call us directly at (857) 207-2145.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midGray mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 ${
                    errors.firstName ? 'border-red-500' : 'border-midGray'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-midGray mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 ${
                    errors.lastName ? 'border-red-500' : 'border-midGray'
                  }`}
                  placeholder="Smith"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-midGray mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 ${
                  errors.email ? 'border-red-500' : 'border-midGray'
                }`}
                placeholder="john.smith@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-midGray mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 ${
                  errors.phone ? 'border-red-500' : 'border-midGray'
                }`}
                placeholder="(555) 123-4567"
                maxLength="14"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-midGray mb-2">Service Needed</label>
              <select 
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 ${
                  errors.service ? 'border-red-500' : 'border-midGray'
                }`}
              >
                <option value="">Select a service...</option>
                <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                <option value="Bathroom Renovation">Bathroom Renovation</option>
                <option value="Deck Construction">Deck Construction</option>
                <option value="Flooring Installation">Flooring Installation</option>
                <option value="Home Restoration">Home Restoration</option>
                <option value="General Repairs">General Repairs</option>
                <option value="New Construction">New Construction</option>
                <option value="Other">Other</option>
              </select>
              {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-midGray mb-2">Project Details</label>
              <textarea 
                rows="4" 
                name="projectDetails"
                value={formData.projectDetails}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange text-gray-900 placeholder-gray-500 resize-vertical ${
                  errors.projectDetails ? 'border-red-500' : 'border-midGray'
                }`}
                placeholder="Please describe your project, timeline, and any specific requirements..."
              />
              {errors.projectDetails && <p className="mt-1 text-sm text-red-500">{errors.projectDetails}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition shadow-lg focus:outline-none focus:ring-2 focus:ring-orange/50 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange text-white hover:bg-orange/90'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message & Get Free Quote'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          {/* Business Info */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 text-orange mt-1 mr-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Phone</h3>
                  <p className="text-midGray">(857) 207-2145</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 text-orange mt-1 mr-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Email</h3>
                  <p className="text-midGray">healthyhomes@homefixandbuild.org</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 text-orange mt-1 mr-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Address</h3>
                  <p className="text-midGray">23 Cheney Place<br />Manchester, NH</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Business Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-midGray">Monday - Friday</span>
                <span className="font-semibold text-navy">7:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midGray">Saturday</span>
                <span className="font-semibold text-navy">8:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midGray">Sunday</span>
                <span className="font-semibold text-navy">Emergency Only</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-navy mb-6">Why Choose Us</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                <span className="text-midGray">15+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                <span className="text-midGray">Free Estimates</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                <span className="text-midGray">Quality Guarantee</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
                <span className="text-midGray">Emergency Services Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Contact;
