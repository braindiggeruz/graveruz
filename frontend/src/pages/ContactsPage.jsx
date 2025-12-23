import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactsPage = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Сообщение отправлено!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: t('footer.phone'), value: '+998 71 200 00 00', href: 'tel:+998712000000' },
    { icon: Mail, label: t('footer.email'), value: 'info@oasis.uz', href: 'mailto:info@oasis.uz' },
    { icon: Clock, label: t('footer.schedule'), value: t('footer.scheduleValue'), href: null },
  ];

  const offices = [
    { city: 'Ташкент', address: t('footer.tashkent'), coords: '41.311081,69.240562' },
    { city: 'Самарканд', address: t('footer.samarkand'), coords: '39.654369,66.959667' },
  ];

  const socials = [
    { icon: MessageCircle, label: 'Telegram', href: 'https://t.me/oasiscredit', color: 'bg-blue-500' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/oasiscredit', color: 'bg-pink-500' },
  ];

  return (
    <Layout>
      <section className="section-padding" data-testid="contacts-page">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              data-testid="contacts-title"
            >
              {t('contacts.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contacts.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="contact-info">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <a 
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors ${!item.href ? 'pointer-events-none' : ''}`}
                      data-testid={`contact-${index}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Offices */}
              <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="offices">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{t('footer.offices')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offices.map((office, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50"
                      data-testid={`office-${index}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{office.city}</p>
                        <p className="text-sm text-muted-foreground">{office.address}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social */}
              <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="socials">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">Мы в соцсетях</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-6 py-3 rounded-full text-white ${social.color} hover:opacity-90 transition-opacity`}
                        data-testid={`social-${social.label.toLowerCase()}`}
                      >
                        <social.icon className="w-5 h-5" />
                        {social.label}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="bg-white rounded-3xl border-0 shadow-card h-fit" data-testid="contact-form">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{t('contacts.form.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t('contacts.form.name')}</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Иван Иванов"
                      className="rounded-xl h-12"
                      data-testid="contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contacts.form.email')}</Label>
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="rounded-xl h-12"
                      data-testid="contact-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('contacts.form.message')}</Label>
                    <Textarea 
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Ваше сообщение..."
                      className="rounded-xl min-h-[150px] resize-none"
                      data-testid="contact-message"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 h-12"
                    disabled={loading}
                    data-testid="contact-submit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Отправка...' : t('contacts.form.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map placeholder */}
          <div className="mt-12 rounded-3xl overflow-hidden h-[400px] bg-muted relative" data-testid="map-placeholder">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Карта офисов</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactsPage;
