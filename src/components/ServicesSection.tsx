import {
  Pill,
  Stethoscope,
  Phone,
  Heart,
  Shield,
  Truck,
  UserCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaggeredAnimation } from "@/hooks/useAnimations";

const ServicesSection = () => {
  useStaggeredAnimation(100);
  const services = [
    {
      icon: Pill,
      title: "Prescription Medicines",
      description:
        "Wide range of authentic medications from trusted pharmaceutical brands with expert consultation.",
      features: ["Generic & Branded", "Quality Assured", "Expert Advice"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Stethoscope,
      title: "Health Checkups",
      description:
        "Comprehensive health screenings and diagnostic services for preventive healthcare.",
      features: ["Full Body Checkup", "Lab Tests", "Health Reports"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: Phone,
      title: "Teleconsultation",
      description:
        "Connect with certified doctors and healthcare professionals from the comfort of your home.",
      features: ["24/7 Available", "Video Calls", "Prescription Delivery"],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Heart,
      title: "Wellness Programs",
      description:
        "Personalized wellness plans and health monitoring for chronic disease management.",
      features: ["Diet Plans", "Fitness Tracking", "Regular Monitoring"],
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <section id="services" className="py-2 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Stethoscope className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From prescription medicines to preventive care, we offer a complete
            range of healthcare services designed to meet all your medical
            needs.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group stagger-animate animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="glass-card floating-card p-8 h-full hover-lift">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 glow-effect hover-glow`}
                  >
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
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="btn-outline-premium w-full mt-6"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
