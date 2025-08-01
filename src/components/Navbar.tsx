import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import lifebloomLogo from "@/assets/lifebloom-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-choose" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/40 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={lifebloomLogo} alt="LifeBloom" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text">
                Lifebloom
              </h1>
              <p className="text-xs text-muted-foreground">
                Prevent.Preserve.Prosper
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Balipara,Tezpur</span>
              </div>
            </div>
            <Button className="btn-premium">
              <a
                href="https://wa.me/918638904234"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white-600 hover:none"
              >
                <Phone className="w-4 h-4" />
                <span>+91 8638904234</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/50 backdrop-blur-md border-t transition-all duration-500 animate-slideDown">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t space-y-3">
                <Button className="btn-premium w-full">
                  <a
                    href="https://wa.me/918638904234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-white-600 hover:none"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 8638904234</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
