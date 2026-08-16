import { useState, useEffect } from "react";

// Testimonials/Facebook sync functions run on a standalone Azure Function App, not the
// Static Web App's own managed API — see azure-functions-facebook/.
const FUNCTIONS_API_BASE = import.meta.env.VITE_FUNCTIONS_API_BASE || '';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ quote: "", name: "", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_API_BASE}/api/testimonials`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      // Fallback to default testimonials
      setTestimonials([
        { quote: "They did an amazing job on my kitchen remodel!", name: "Sarah M.", location: "Somerville, MA" },
        { quote: "Reliable and skilled — I'll definitely hire them again.", name: "David R.", location: "Waltham, MA" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear any previous status when user starts typing
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quote.trim() || !formData.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in both your name and testimonial.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${FUNCTIONS_API_BASE}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: result.message || 'Thank you for your testimonial! It will be reviewed and published soon.' 
        });
        setFormData({ quote: "", name: "", location: "" });
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.message || 'Sorry, there was an error submitting your testimonial.' 
        });
      }
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Sorry, there was an error submitting your testimonial. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white text-black py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-orange text-center">
          What Our Customers Say
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-10">
            <div className="animate-pulse text-midGray">Loading testimonials...</div>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t, i) => (
              <div
                key={t.id || i}
                className="bg-lightGray border border-midGray/10 rounded-2xl p-6 h-full shadow-md"
              >
                <p className="text-navy text-lg md:text-xl">"{t.quote}"</p>
                <div className="mt-4 font-semibold text-navy">
                  {t.name}
                  {t.location && <span className="block text-sm text-midGray/80">{t.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Add Testimonial Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full mt-12 bg-lightGray border border-midGray/10 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-navy mb-4 text-center">
            Share Your Experience
          </h3>
          
          {/* Status Messages */}
          {submitStatus && (
            <div className={`mb-4 p-4 rounded-lg text-center ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {submitStatus.message}
            </div>
          )}
          
          <textarea
            name="quote"
            placeholder="Tell us about your experience with Healthy Homes LLC..."
            value={formData.quote}
            onChange={handleChange}
            required
            className="w-full p-3 mb-3 rounded border border-midGray bg-white text-navy focus:ring-2 focus:ring-orange focus:border-orange"
            rows="4"
          />
          <input
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 mb-3 rounded border border-midGray bg-white text-navy focus:ring-2 focus:ring-orange focus:border-orange"
          />
          <input
            name="location"
            placeholder="City, State (optional)"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border border-midGray bg-white text-navy focus:ring-2 focus:ring-orange focus:border-orange"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded font-semibold transition block mx-auto ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-orange text-white hover:bg-yellow hover:text-navy'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Testimonials;