import { Pill, Stethoscope, Phone, Heart, Shield, Truck, UserCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const services = [
    {
      icon: Pill,
      title: "Prescription Medicines",
      description: "Wide range of authentic medications from trusted pharmaceutical brands with expert consultation.",
      features: ["Generic & Branded", "Quality Assured", "Expert Advice"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Stethoscope,
      title: "Health Checkups",
      description: "Comprehensive health screenings and diagnostic services for preventive healthcare.",
      features: ["Full Body Checkup", "Lab Tests", "Health Reports"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Phone,
      title: "Teleconsultation",
      description: "Connect with certified doctors and healthcare professionals from the comfort of your home.",
      features: ["24/7 Available", "Video Calls", "Prescription Delivery"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "Wellness Programs",
      description: "Personalized wellness plans and health monitoring for chronic disease management.",
      features: ["Diet Plans", "Fitness Tracking", "Regular Monitoring"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Health Insurance",
      description: "Comprehensive health insurance plans and medical coverage options for you and your family.",
      features: ["Family Plans", "Cashless Claims", "Wide Network"],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Truck,
      title: "Home Delivery",
      description: "Fast and secure delivery of medicines and healthcare products to your doorstep.",
      features: ["Same Day Delivery", "Temperature Controlled", "Secure Packaging"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const additionalServices = [
    { icon: UserCheck, title: "Expert Consultation", description: "Certified pharmacists and healthcare professionals" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer service and emergency support" },
    { icon: Shield, title: "Quality Assurance", description: "Authentic medicines with proper storage and handling" },
    { icon: Heart, title: "Patient Care", description: "Personalized care plans and health monitoring" }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Stethoscope className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Our Services</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From prescription medicines to preventive care, we offer a complete range of healthcare services designed to meet all your medical needs.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group">
                <div className="glass-card floating-card p-8 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 glow-effect`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary group-hover:text-secondary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="btn-outline-premium w-full mt-6">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-primary mb-4">
              Why Choose LifeBloom?
            </h3>
            <p className="text-lg text-muted-foreground">
              Experience the difference with our premium healthcare services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 glow-effect">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-primary">{service.title}</h4>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;