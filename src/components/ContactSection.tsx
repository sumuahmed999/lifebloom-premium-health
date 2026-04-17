import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStaggeredAnimation } from "@/hooks/useAnimations";
import { supabase } from "@/integrations/supabase/client";
import type { ContactInfo, GetInTouchContent, ContactCard as ContactCardType } from "@/types/admin-content";
import { ContactCard } from "@/components/ContactCard";
import { ContactCardModal } from "@/components/ContactCardModal";
import ContentService from "@/lib/services/ContentService";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactData, setContactData] = useState<ContactInfo | null>(null);
  const [getInTouchContent, setGetInTouchContent] = useState<GetInTouchContent | null>(null);
  
  // New state for contact cards
  const [contactCards, setContactCards] = useState<ContactCardType[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ContactCardType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch contact information from database
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching contact info:', error);
          return;
        }

        setContactData(data);
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };

    const fetchGetInTouchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('get_in_touch_content')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching get in touch content:', error);
          return;
        }

        setGetInTouchContent(data);
      } catch (err) {
        console.error('Error fetching get in touch content:', err);
      }
    };

    // Fetch contact cards from database
    const fetchContactCards = async () => {
      setCardsLoading(true);
      setCardsError(null);
      
      try {
        const response = await ContentService.getAll<ContactCardType>('contact_cards', {
          status: true
        });

        if (response.success && response.data) {
          // Sort by sort_order ascending
          const sortedCards = response.data.sort((a, b) => a.sort_order - b.sort_order);
          setContactCards(sortedCards);
        } else {
          setCardsError(response.error?.message || 'Failed to load contact cards');
        }
      } catch (err) {
        console.error('Error fetching contact cards:', err);
        setCardsError('An unexpected error occurred');
      } finally {
        setCardsLoading(false);
      }
    };

    fetchContactInfo();
    fetchGetInTouchContent();
    fetchContactCards();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Phone number validation
    if (name === 'phone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Only allow up to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      
      // Validate phone number
      if (limitedDigits.length > 0 && limitedDigits.length < 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else if (limitedDigits.length === 10) {
        setPhoneError(null);
      } else {
        setPhoneError(null);
      }
      
      setFormData({
        ...formData,
        [name]: limitedDigits,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate phone number if provided
    if (formData.phone && formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: submitError } = await supabase
        .from('enquiries')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        }]);

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setPhoneError(null);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle contact card click
  const handleCardClick = (card: ContactCardType) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    // Delay clearing selectedCard to allow exit animation
    setTimeout(() => setSelectedCard(null), 300);
  };

  // Retry loading contact cards
  const retryLoadCards = async () => {
    setCardsLoading(true);
    setCardsError(null);
    
    try {
      const response = await ContentService.getAll<ContactCardType>('contact_cards', {
        status: true
      });

      if (response.success && response.data) {
        const sortedCards = response.data.sort((a, b) => a.sort_order - b.sort_order);
        setContactCards(sortedCards);
      } else {
        setCardsError(response.error?.message || 'Failed to load contact cards');
      }
    } catch (err) {
      console.error('Error fetching contact cards:', err);
      setCardsError('An unexpected error occurred');
    } finally {
      setCardsLoading(false);
    }
  };

  // Format operating hours for display
  const formatOperatingHours = () => {
    if (!contactData?.operating_hours) return "Mon - Sat: 8:00 AM - 10:00 PM";
    
    const hours = contactData.operating_hours;
    const workingDays = Object.entries(hours)
      .filter(([_, schedule]) => !schedule.closed)
      .map(([day, schedule]) => ({
        day,
        open: schedule.open,
        close: schedule.close
      }));

    if (workingDays.length === 0) return "Hours not available";

    // Check if all working days have same hours
    const firstDay = workingDays[0];
    const allSameHours = workingDays.every(
      day => day.open === firstDay.open && day.close === firstDay.close
    );

    if (allSameHours && workingDays.length > 1) {
      const dayNames = workingDays.map(d => d.day.slice(0, 3)).join(', ');
      return `${dayNames}: ${firstDay.open} - ${firstDay.close}`;
    }

    // Return first day's hours as summary
    return `${firstDay.day}: ${firstDay.open} - ${firstDay.close}`;
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 stagger-animate animate-on-scroll px-4">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-secondary/30">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="text-xs sm:text-sm font-medium text-secondary">
              {getInTouchContent?.badge_text || "Get In Touch"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary leading-tight px-4">
            {getInTouchContent?.heading || "Contact LifeBloom"}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            {getInTouchContent?.description || "Ready to experience premium healthcare? Get in touch with our team for consultations, appointments, or any questions about our services."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 stagger-animate animate-on-scroll stagger-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">
                {getInTouchContent?.intro_heading || "Get in Touch"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                {getInTouchContent?.intro_description || "We're here to help you with all your healthcare needs. Reach out to us through any of the following channels, and our dedicated team will assist you promptly."}
              </p>
            </div>

            {/* Contact Cards - Dynamic from Database */}
            <div className="stagger-animate animate-on-scroll stagger-2">
              {cardsLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card p-6 animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-full mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : cardsError ? (
                // Error state with retry
                <div className="glass-card p-8 text-center">
                  <p className="text-destructive mb-4">{cardsError}</p>
                  <Button onClick={retryLoadCards} variant="outline">
                    Retry
                  </Button>
                </div>
              ) : contactCards.length > 0 ? (
                // Display contact cards in 2x2 grid
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {contactCards.map((card) => (
                    <ContactCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card)}
                    />
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No contact cards available at the moment.</p>
                </div>
              )}
            </div>

            {/* Contact Card Modal */}
            <ContactCardModal
              card={selectedCard}
              isOpen={modalOpen}
              onClose={handleCloseModal}
            />

            {/* Map Placeholder */}
            <div className="glass-card p-4 sm:p-6 stagger-animate animate-on-scroll stagger-3">
              <h4 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">
                Find Our Location
              </h4>
              <div className="w-full h-48 sm:h-64 md:h-[250px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden">
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
          <div className="glass-card p-6 sm:p-8 stagger-animate animate-on-scroll stagger-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-6">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <div className="text-center space-y-4 py-8 sm:py-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-600">
                  Message Sent!
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}
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
                      placeholder="1234567890"
                      maxLength={10}
                    />
                    {phoneError && (
                      <p className="text-sm text-destructive mt-1">{phoneError}</p>
                    )}
                    {formData.phone && !phoneError && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.phone.length}/10 digits
                      </p>
                    )}
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

                <Button type="submit" className="btn-premium w-full group min-h-[44px]" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
