import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";
import lifebloomLogo from "@/assets/lifebloom-logo.png";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Our Services", href: "#services" },
    { label: "Health Checkups", href: "#services" },
    { label: "Contact Us", href: "#contact" },
  ];

  const services = [
    { label: "Prescription Medicines", href: "#services" },
    { label: "Home Delivery", href: "#services" },
    { label: "Wellness Programs", href: "#services" },
    { label: "Health Insurance", href: "#services" },
    { label: "Emergency Support", href: "#contact" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1GeX35jsr9/",
      label: "Facebook",
    },
    { icon: Twitter, href: "#", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/lifebloom.in",
      label: "Instagram",
    },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <img src={lifebloomLogo} alt="LifeBloom" className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-display font-bold gradient-text">
                  LifeBloom
                </h3>
                <p className="text-sm text-muted-foreground">
                  Prevent.Preserve.Prosper
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Your trusted partner in healthcare. We provide comprehensive
              medical solutions with a focus on quality, accessibility, and
              patient-centered care.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-foreground">+91 8638904234</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="text-foreground">lifebloomin@yahoo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-foreground">Balipara, Tezpur</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-secondary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-primary">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-muted-foreground hover:text-secondary transition-colors duration-300"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-primary">
              Stay Connected
            </h4>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for health tips and updates.
            </p>

            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 input-premium rounded-r-none border-r-0"
                />
                <button className="btn-premium rounded-l-none px-4">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Follow Us
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 LifeBloom. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Developed by </span>
              <a
                href="https://sumuahmed9.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="italic text-primary hover:underline">
                  Sumu Ahmed
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
