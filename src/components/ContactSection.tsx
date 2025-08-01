import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStaggeredAnimation } from "@/hooks/useAnimations";

const ContactSection = () => {
  useStaggeredAnimation(150);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      info: "+91 8638904234",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "info@lifebloom.com",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Balipara, Tezpur",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Clock,
      title: "Opening Hours",
      info: "Mon - Sat: 8:00 AM - 10:00 PM",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Mail className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
            Contact LifeBloom
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to experience premium healthcare? Get in touch with our team
            for consultations, appointments, or any questions about our
            services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8 stagger-animate animate-on-scroll stagger-1">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6">
                Get in Touch
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We're here to help you with all your healthcare needs. Reach out
                to us through any of the following channels, and our dedicated
                team will assist you promptly.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-6 stagger-animate animate-on-scroll stagger-2">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="glass-card floating-card p-6 hover-lift"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 hover-glow`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-primary mb-2">
                      {item.title}
                    </h4>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="glass-card p-6 stagger-animate animate-on-scroll stagger-3">
              <h4 className="text-lg font-semibold text-primary mb-4">
                Find Our Location
              </h4>
              <div className="w-full h-64 md:h-[250px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden">
                {/* Embedded Google Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56965.416909397834!2d92.69932522751142!3d26.82918209541802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744be28bdf25297%3A0xd6a30a74bee939c4!2sBalipara%2C%20Assam%20784101!5e0!3m2!1sen!2sin!4v1754084471673!5m2!1sen!2sin"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 stagger-animate animate-on-scroll stagger-4">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <div className="text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-green-600">
                  Message Sent!
                </h4>
                <p className="text-muted-foreground">
                  Thank you for contacting us. We'll get back to you within 2
                  hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-premium"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-premium"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-premium"
                      placeholder="+91 1234567890"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="input-premium"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={20}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="input-premium resize-none"
                    placeholder="Tell us about your healthcare needs or questions..."
                  />
                </div>

                <Button type="submit" className="btn-premium w-full group">
                  Send Message
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
