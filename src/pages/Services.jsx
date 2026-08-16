import SEO from "../components/SEO";

const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Home Construction and Repair",
  "provider": {
    "@type": "HomeAndConstructionBusiness",
    "name": "Healthy Homes, LLC"
  },
  "areaServed": {
    "@type": "State",
    "name": "New Hampshire"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      "Kitchen Remodeling",
      "Bathroom Renovation",
      "Flooring Installation",
      "Deck Construction",
      "Exterior Repairs"
    ].map((name) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Service", "name": name }
    }))
  }
};

const Services = () => (
  <div className="min-h-screen bg-lightGray">
    <SEO
      title="Our Services"
      description="Kitchen remodeling, bathroom renovation, flooring installation, deck construction, and exterior repairs — professional home services in Manchester, NH from Healthy Homes, LLC."
      path="/services"
      jsonLd={SERVICES_JSON_LD}
    />
    {/* Hero Section */}
    <div className="relative h-64 md:h-80 bg-midGray overflow-hidden">
      <img
        src="/images/services-hero-interior-bathroom.jpg"
        alt="Professional bathroom renovation services"
        loading="eager"
        fetchPriority="high"
        width="1920"
        height="1079"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-navy bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl">Professional construction and home repair solutions</p>
        </div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto py-16 px-4 md:px-8">
      {/* Interior Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Interior Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Kitchen Remodeling</h3>
            <p className="text-midGray mb-4">Complete kitchen renovations including cabinets, countertops, appliances, and flooring.</p>
            <ul className="text-sm text-midGray space-y-1">
              <li>• Custom cabinetry installation</li>
              <li>• Countertop replacement</li>
              <li>• Appliance installation</li>
              <li>• Backsplash and lighting</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Bathroom Renovation</h3>
            <p className="text-midGray mb-4">Transform your bathroom with modern fixtures, tiling, and efficient layouts.</p>
            <ul className="text-sm text-midGray space-y-1">
              <li>• Shower and tub installation</li>
              <li>• Tile work and flooring</li>
              <li>• Vanity and mirror installation</li>
              <li>• Plumbing fixture updates</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Flooring Installation</h3>
            <p className="text-midGray mb-4">Professional installation of hardwood, laminate, tile, and carpet flooring.</p>
            <ul className="text-sm text-midGray space-y-1">
              <li>• Hardwood floor installation</li>
              <li>• Laminate and vinyl flooring</li>
              <li>• Tile installation</li>
              <li>• Carpet installation and repair</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exterior Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Exterior Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Deck Construction</h3>
            <p className="text-midGray mb-4">Custom deck building and repair services to enhance your outdoor living space.</p>
            <ul className="text-sm text-midGray space-y-1">
              <li>• Custom deck design and build</li>
              <li>• Deck repair and maintenance</li>
              <li>• Railing installation</li>
              <li>• Deck staining and sealing</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Exterior Repairs</h3>
            <p className="text-midGray mb-4">Keep your home's exterior in excellent condition with our repair services.</p>
            <ul className="text-sm text-midGray space-y-1">
              <li>• Siding repair and replacement</li>
              <li>• Window and door installation</li>
              <li>• Roof repairs and maintenance</li>
              <li>• Gutter installation and cleaning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-navy mb-8">Our Specialties</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4">
            <div className="text-2xl font-bold text-orange mb-2">Carpentry</div>
            <div className="text-midGray text-sm">Custom woodwork & built-ins</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-orange mb-2">Electrical</div>
            <div className="text-midGray text-sm">Safe wiring & fixture installation</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-orange mb-2">Home Restoration</div>
            <div className="text-midGray text-sm">Storm, fire & water damage repair</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-orange mb-2">New Contruction</div>
            <div className="text-midGray text-sm">Ground-up builds & additions</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Services;
