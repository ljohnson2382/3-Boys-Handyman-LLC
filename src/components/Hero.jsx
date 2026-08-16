import { Link } from "react-router-dom";
import Carousel from './Carousel';

const Hero = () => {
  // Solid-color overlay only — no /images/hero.jpg exists, and requesting it on
  // every homepage load was a wasted 404 request.
  const heroStyle = {
    backgroundColor: "rgba(65,90,119,0.45)",
  };

  // Only include existing carousel images from /public/images
  const carouselImages = [
    '/images/carousel-1.jpg',
    '/images/about-hero-exterior-home.jpg',
    '/images/services-hero-interior-bathroom.jpg',
    '/images/contact-hero-exterior-landscaping.jpg',
    '/images/services-section-exterior-deck.jpg',
    '/images/about-section-interior-kitchen.jpg',
    '/images/image_6.jpg'
  ];

  return (
    <>
      <Carousel images={carouselImages} interval={6000} />

      <section
        role="banner"
        className="relative w-full flex items-center justify-center text-center"
        style={heroStyle}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-16 w-full flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight whitespace-normal md:whitespace-nowrap">
              Expert Home Services
            </h1>

            <p className="text-lg md:text-xl text-lightGray mt-4 md:mt-6 max-w-prose mx-auto">
              Professional construction and home repair solutions. From small fixes to major renovations, we build, repair, and transform your space with precision and care.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/contact"
                aria-label="Get a free quote"
                className="inline-block bg-orange text-white font-semibold px-6 py-3 rounded-lg text-center hover:opacity-90 transition shadow-md focus:outline-none focus:ring-2 focus:ring-orange/50"
              >
                Get Free Quote
              </Link>
              <Link
                to="/portfolio"
                aria-label="View our work portfolio"
                className="inline-block bg-white text-navy font-semibold px-6 py-3 rounded-lg text-center hover:bg-lightGray transition shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;