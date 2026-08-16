import { useState } from 'react';

// Testimonials/Facebook sync functions run on a standalone Azure Function App, not the
// Static Web App's own managed API — see azure-functions-facebook/.
const FUNCTIONS_API_BASE = import.meta.env.VITE_FUNCTIONS_API_BASE || '';

const AdminTestimonials = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const syncFacebookReviews = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${FUNCTIONS_API_BASE}/api/sync-facebook-reviews`);

      const result = await response.json();

      if (result.success) {
        setPendingTestimonials(result.testimonials || []);
        setMessage(`✅ Successfully synced ${result.testimonials?.length || 0} Facebook reviews`);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to sync Facebook reviews: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const postTestimonialToFacebook = async (testimonial) => {
    try {
      const response = await fetch(`${FUNCTIONS_API_BASE}/api/post-testimonial-to-facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testimonial })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Posted testimonial from ${testimonial.name} to Facebook`);
      } else {
        setMessage(`❌ Failed to post to Facebook: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error posting to Facebook: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-lightGray p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy mb-8">Testimonials Admin</h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">Facebook Integration</h2>
          
          <div className="space-y-4">
            <button
              onClick={syncFacebookReviews}
              disabled={loading}
              className={`px-4 py-2 rounded font-semibold ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {loading ? 'Syncing...' : 'Sync Facebook Reviews'}
            </button>
            
            <p className="text-sm text-midGray">
              This will fetch recent Facebook reviews (4-5 stars) and add them to your testimonials.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-navy mb-4">Pending Testimonials</h2>
          
          {pendingTestimonials.length === 0 ? (
            <p className="text-midGray">No pending testimonials at the moment.</p>
          ) : (
            <div className="space-y-4">
              {pendingTestimonials.map(testimonial => (
                <div key={testimonial.id} className="border border-midGray/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-navy">{testimonial.name}</h3>
                    <span className="text-sm text-midGray">{testimonial.location}</span>
                  </div>
                  
                  <p className="text-midGray mb-4">"{testimonial.quote}"</p>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      onClick={() => {/* TODO: Approve testimonial */}}
                    >
                      Approve
                    </button>
                    
                    <button 
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      onClick={() => postTestimonialToFacebook(testimonial)}
                    >
                      Post to Facebook
                    </button>
                    
                    <button 
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      onClick={() => {/* TODO: Reject testimonial */}}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonials;