import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import HowItWorksSection from '../components/home/HowItWorksSection';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Calculator, FileText, Fingerprint, CheckCircle, ArrowRight, Clock, Shield, File } from 'lucide-react';

const HowItWorksPage = () => {
  const { t } = useI18n();

  const documents = [
    'Паспорт гражданина Узбекистана',
    'Справка о прописке',
    'Документы о регистрации бизнеса (для ИП/ЮЛ)',
    'Финансовая отчетность (при необходимости)',
  ];

  const requirements = [
    { title: 'Возраст', value: 'от 21 до 65 лет' },
    { title: 'Гражданство', value: 'Узбекистан' },
    { title: 'Регистрация', value: 'Действующая прописка' },
    { title: 'Кредитная история', value: 'Без просрочек' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background" data-testid="how-it-works-hero">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('howItWorks.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Простой и прозрачный процесс получения кредита за 4 шага
          </p>
        </div>
      </section>

      {/* Steps */}
      <HowItWorksSection />

      {/* Detailed Steps */}
      <section className="section-padding bg-muted/30" data-testid="detailed-steps">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
            Подробнее о каждом шаге
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <Card className="bg-white rounded-3xl border-0 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      1. Рассчитайте условия
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Воспользуйтесь нашим калькулятором, чтобы подобрать оптимальную сумму и срок кредита. 
                      Вы сразу увидите ориентировочный ежемесячный платёж и общую переплату.
                    </p>
                    <Link to="/calculator">
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        Перейти к калькулятору
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-white rounded-3xl border-0 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      2. Отправьте заявку
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Заполните форму заявки и подтвердите номер телефона через SMS. 
                      Это занимает не более 5 минут.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Время заполнения: ~5 минут</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-white rounded-3xl border-0 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      3. Загрузите документы и пройдите идентификацию
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Загрузите фото паспорта и справки о прописке, затем подтвердите личность через систему myID.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold text-foreground mb-2">Необходимые документы:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {documents.map((doc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <File className="w-4 h-4 text-primary" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h4 className="font-semibold text-foreground mb-2">myID идентификация:</h4>
                        <p className="text-sm text-muted-foreground">
                          myID — государственная система электронной идентификации. 
                          Подтвердите личность через приложение или сайт myID.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="bg-white rounded-3xl border-0 shadow-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      4. Получите решение и деньги
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      После проверки документов вы получите решение в течение 1 рабочего дня. 
                      При одобрении деньги поступят на ваш счёт.
                    </p>
                    <div className="flex items-center gap-2 text-secondary">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Без скрытых комиссий</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding" data-testid="requirements">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
            Требования к заёмщику
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => (
              <Card key={index} className="bg-white rounded-2xl border-0 shadow-card text-center">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">{req.title}</p>
                  <p className="font-heading text-xl font-semibold text-foreground">{req.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary" data-testid="how-it-works-cta">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-white/80 mb-8">
            Рассчитайте условия и отправьте заявку прямо сейчас
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/calculator">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 px-8">
                Рассчитать кредит
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-8">
                Выбрать продукт
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorksPage;
