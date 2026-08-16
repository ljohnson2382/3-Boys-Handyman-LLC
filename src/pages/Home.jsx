import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import SEO, { SITE } from "../components/SEO";

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": SITE.SITE_NAME,
  "image": SITE.DEFAULT_IMAGE,
  "url": SITE.SITE_URL,
  "telephone": "+1-857-207-2145",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "23 Cheney Place",
    "addressLocality": "Manchester",
    "addressRegion": "NH",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "State",
    "name": "New Hampshire"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "16:00"
    }
  ]
};

const Home = () => {
  return (
    <div className="fade-in">
      <SEO
        title="Home Remodeling & Construction in Manchester, NH"
        description="Healthy Homes, LLC provides professional kitchen remodeling, bathroom renovation, deck construction, and home repair services in Manchester, New Hampshire. Free estimates."
        path="/"
        jsonLd={LOCAL_BUSINESS_JSON_LD}
      />
      <Hero />
      <Stats />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;