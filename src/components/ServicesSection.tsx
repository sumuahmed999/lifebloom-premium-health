import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  Stethoscope,
  Phone,
  Heart,
  Shield,
  Truck,
  UserCheck,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaggeredAnimation } from "@/hooks/useAnimations";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/types/admin-content";

// Icon mapping
const iconMap: Record<string, any> = {
  pill: Pill,
  stethoscope: Stethoscope,
  phone: Phone,
  heart: Heart,
  shield: Shield,
  truck: Truck,
  userCheck: UserCheck,
  clock: Clock,
  users: Users,
};

// Color mapping
const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  yellow: "from-yellow-500 to-yellow-600",
  pink: "from-pink-500 to-pink-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
};

const ServicesSection = () => {
  // Temporarily disabled animation for debugging
  // useStaggeredAnimation(100);
  const navigate = useNavigate();
  
  // Initialize with fallback data immediately
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: "Prescription Medicines",
      description: "Wide range of authentic medications from trusted pharmaceutical brands with expert consultation.",
      icon: "pill",
      features: ["Generic & Branded", "Quality Assured", "Expert Advice"],
      color_scheme: "blue",
      published: true,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: "Health Checkups",
      description: "Comprehensive health screenings and diagnostic services for preventive healthcare.",
      icon: "stethoscope",
      features: ["Full Body Checkup", "Lab Tests", "Health Reports"],
      color_scheme: "green",
      published: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: "In-Clinic Consultation",
      description: "Book appointments with experienced doctors for personalized face-to-face consultation.",
      icon: "users",
      features: ["Expert Doctors", "Flexible Slots", "Modern Facilities"],
      color_scheme: "yellow",
      published: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: "Wellness Programs",
      description: "Personalized wellness plans and health guidance for chronic disease management.",
      icon: "heart",
      features: ["Diet Plans", "Patient specific illness Monitoring"],
      color_scheme: "pink",
      published: true,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as Service[]);
  
  const [loading, setLoading] = useState(false);

  console.log('ServicesSection rendering with services:', services.length, services);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services from database...');
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        console.log('Supabase response:', { data, error });

        if (!error && data && data.length > 0) {
          console.log('Fetched services from database:', data);
          setServices(data);
        } else {
          console.log('Using fallback services data. Error:', error, 'Data length:', data?.length);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-2 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16">
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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="glass-card p-8 h-full animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-2xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : (
            services.map((service, index) => {
              const Icon = iconMap[service.icon] || Heart;
              const color = colorMap[service.color_scheme] || "from-blue-500 to-blue-600";
              const features = Array.isArray(service.features) ? service.features : [];
              
              return (
                <div
                  key={service.id}
                  className="group"
                >
                  <div className="glass-card floating-card p-8 h-full hover-lift">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 glow-effect hover-glow`}
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
                        {features.map((feature, featureIndex) => (
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
                        onClick={() => navigate(`/services/${service.id}`)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
