import SEO from "../components/SEO";

const About = () => (
  <div className="min-h-screen bg-lightGray">
    <SEO
      title="About Us"
      description="Learn about Healthy Homes, LLC — 15+ years of professional construction and home repair experience serving Manchester, New Hampshire with quality craftsmanship you can trust."
      path="/about"
    />
    {/* Hero Section */}
    <div className="relative h-64 md:h-80 bg-midGray overflow-hidden">
      <img
        src="/images/about-hero-exterior-home.jpg"
        alt="Home exterior renovation"
        className="w-full h-full object-cover opacity-80"
        loading="eager"
        fetchPriority="high"
        width="1920"
        height="1282"
      />
      <div className="absolute inset-0 bg-navy bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Healthy Homes, LLC</h1>
          <p className="text-xl">Professional craftsmanship and quality service you can trust</p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-6xl mx-auto py-16 px-4 md:px-8">
      {/* Company Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-navy mb-6">Our Story</h2>
          <p className="text-midGray mb-4 leading-relaxed">
            Healthy Homes, LLC was founded on the principle that quality craftsmanship 
            shouldn't be a luxury. We're a family-owned business committed to providing 
            expert construction and renovation services throughout Manchester, New Hampshire
            and the surrounding areas.
          </p>
          <p className="text-midGray mb-4 leading-relaxed">
            Our mission is to deliver professional craftsmanship with honesty, reliability, 
            and a customer-first approach. Every project, from small repairs to major renovations, 
            receives our full attention and dedication to excellence.
          </p>
          <p className="text-midGray leading-relaxed">
            We believe in building lasting relationships with our clients through transparent 
            communication, fair pricing, and work that stands the test of time.
          </p>
        </div>
        <div className="relative">
          <img
            src="/images/about-section-interior-kitchen.jpg"
            alt="Interior kitchen renovation"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
            width="1920"
            height="1280"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Quality First</h3>
            <p className="text-midGray">
              We never compromise on quality. Every project is completed with premium materials 
              and meticulous attention to detail.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">On-Time Service</h3>
            <p className="text-midGray">
              Your time is valuable. We show up when scheduled and complete projects 
              within the agreed timeline.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Clear Communication</h3>
            <p className="text-midGray">
              No surprises. We keep you informed throughout the entire process with 
              transparent pricing and regular updates.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-navy mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl font-bold text-orange mb-2">50+</div>
            <div className="text-midGray">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange mb-2">15+</div>
            <div className="text-midGray">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange mb-2">100%</div>
            <div className="text-midGray">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange mb-2">24/7</div>
            <div className="text-midGray">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;