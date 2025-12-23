import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Heart, Target, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const { t } = useI18n();

  const values = [
    { icon: Shield, title: t('about.value1'), desc: 'Мы открыто показываем все условия и не скрываем комиссий' },
    { icon: Zap, title: t('about.value2'), desc: 'Решение по заявке за 1 рабочий день' },
    { icon: Users, title: t('about.value3'), desc: 'Круглосуточная поддержка по телефону и в мессенджерах' },
    { icon: Heart, title: t('about.value4'), desc: 'Поддерживаем развитие малого бизнеса в регионах' },
  ];

  const stats = [
    { value: '2018', label: 'Год основания' },
    { value: '1000+', label: 'Довольных клиентов' },
    { value: '5', label: 'Продуктов' },
    { value: '2', label: 'Офиса' },
  ];

  return (
    <Layout>
      <section className="section-padding" data-testid="about-page">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h1 
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
                data-testid="about-title"
              >
                {t('about.title')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('about.subtitle')}
              </p>
              <Link to="/products">
                <Button className="rounded-full bg-primary hover:bg-primary/90 px-8" data-testid="about-cta">
                  Наши продукты
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg"
                alt="Team"
                className="w-full h-[400px] object-cover rounded-3xl shadow-float"
                data-testid="about-image"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white rounded-2xl p-6 shadow-lg">
                <p className="font-heading text-3xl font-bold">1000+</p>
                <p className="text-white/80">Клиентов</p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-24" data-testid="mission-section">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Target className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {t('about.mission')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-24">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              {t('about.values')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="values-grid">
              {values.map((value, index) => (
                <Card key={index} className="bg-white rounded-3xl border-0 shadow-card hover:shadow-card-hover transition-shadow" data-testid={`value-${index}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-primary rounded-3xl p-8 md:p-12" data-testid="stats-section">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <p className="font-heading text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability */}
          <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
            <img 
              src="https://images.unsplash.com/photo-1701021934374-df29f8f0ecf0"
              alt="Sustainability"
              className="w-full h-[400px] object-cover rounded-3xl"
            />
            <div className="space-y-6">
              <Award className="w-12 h-12 text-secondary" />
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Мы поддерживаем устойчивое развитие малого бизнеса
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Oasis Credit активно содействует развитию малого и среднего предпринимательства в Узбекистане. 
                Мы предоставляем доступное финансирование для фермеров, самозанятых и начинающих предпринимателей, 
                помогая им расти и развиваться.
              </p>
              <div className="flex gap-4">
                <Link to="/public-info">
                  <Button variant="outline" className="rounded-full border-primary text-primary">
                    Публичная информация
                  </Button>
                </Link>
                <Link to="/financial-info">
                  <Button variant="outline" className="rounded-full border-primary text-primary">
                    Финансовая информация
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
