import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import type { Service } from '@/types/admin-content';
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
} from 'lucide-react';

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

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  pink: 'from-pink-500 to-pink-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single();

        if (error) throw error;
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Service Not Found</h1>
            <p className="text-muted-foreground">The service you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Heart;
  const color = colorMap[service.color_scheme] || 'from-blue-500 to-blue-600';
  const features = Array.isArray(service.features) ? service.features : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Service Header */}
        <div className="glass-card p-12 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div
              className={`w-24 h-24 bg-gradient-to-r ${color} rounded-3xl flex items-center justify-center flex-shrink-0 glow-effect`}
            >
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Key Features</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 text-${service.color_scheme}-500`} />
                  <span className="text-base text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Why Choose This Service?</h2>
            <div className="space-y-4 text-muted-foreground text-base">
              <p>
                At LifeBloom Premium Health, we are committed to providing you with the highest quality {service.title.toLowerCase()} services. Our experienced team ensures that you receive personalized care tailored to your specific needs.
              </p>
              <p>
                We use state-of-the-art equipment and follow the latest medical protocols to ensure your safety and satisfaction. Your health and well-being are our top priorities.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        {service.content && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold text-primary mb-6">About This Service</h2>
            <div 
              className="prose prose-base max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        )}

        {/* Call to Action */}
        <div className="glass-card p-12 text-center">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our {service.title.toLowerCase()} services or to schedule an appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-premium"
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
            >
              View All Services
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
