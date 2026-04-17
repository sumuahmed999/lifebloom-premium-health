import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import lifebloomLogo from "@/assets/lifebloom-logo.png";

interface NavItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute?: boolean) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // If it's a route (like /blog), navigate directly
    if (isRoute) {
      navigate(href);
      return;
    }
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Store the target section in sessionStorage
      sessionStorage.setItem('scrollTarget', href);
    } else {
      // Already on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Effect to handle scrolling after navigation
  useEffect(() => {
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget && location.pathname === '/') {
      // Wait for page to fully load
      setTimeout(() => {
        const element = document.querySelector(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        sessionStorage.removeItem('scrollTarget');
      }, 300);
    }
  }, [location]);

  const navItems: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-choose" },
    { label: "Blog", href: "/blog", isRoute: true },
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
                LifeBloom
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
                onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium cursor-pointer"
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
                  onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                  className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 cursor-pointer"
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
