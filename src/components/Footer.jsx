import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy border-t border-midGray/40">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div>
          <div className="text-orange font-extrabold text-xl">Healthy Homes, LLC</div>
          <p className="text-lightGray mt-2">
            Professional construction and home repair services in Manchester, New Hampshire.
          </p>
        </div>

        <nav className="flex gap-6 text-lightGray">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/services" className="hover:text-white">Services</Link>
          <Link to="/portfolio" className="hover:text-white">Portfolio</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </nav>
      </div>

      <div className="text-center text-lightGray/70 text-sm pb-6">
        © {new Date().getFullYear()} Healthy Homes, LLC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;