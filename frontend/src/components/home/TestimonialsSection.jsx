import { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n';
import { Card, CardContent } from '../ui/card';
import { Star, Quote } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TestimonialsSection = () => {
  const { locale, t } = useI18n();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const getText = (testimonial) => {
    return testimonial[`text_${locale}`] || testimonial.text_ru;
  };

  if (loading) {
    return (
      <section className="section-padding bg-muted/30" data-testid="testimonials-section-loading">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-muted rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            data-testid="testimonials-title"
          >
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="bg-white rounded-3xl border-0 shadow-card hover:shadow-card-hover transition-shadow"
              data-testid={`testimonial-${index}`}
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20" />
                
                {/* Text */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "{getText(testimonial)}"
                </p>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Author */}
                <div className="pt-4 border-t">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.business}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
