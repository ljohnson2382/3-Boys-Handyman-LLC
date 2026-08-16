import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-navy/90 backdrop-blur-md z-50 shadow-md">
      {/* Logo Section */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center mx-auto md:mx-0">
          <img src="/logo.svg" alt="Healthy Homes, LLC" className="h-24 md:h-32 w-auto" />
          <span className="sr-only">Healthy Homes, LLC</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-orange focus:outline-none text-2xl p-2 absolute right-4 top-4"
        >
          ☰
        </button>
      </div>

      {/* Desktop Navigation Links - Bottom */}
      <div className="hidden md:block bg-navy/80 border-t border-midGray">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end space-x-8 py-3 pr-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-orange transition-colors text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-midGray">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-midGray hover:text-orange transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;