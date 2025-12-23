import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { formatCurrency, formatNumber } from '../lib/utils';
import { 
  ArrowLeft, ArrowRight, Check, Shield, Clock, FileText, Upload, 
  Fingerprint, CheckCircle, AlertCircle, Info, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { locale, t } = useI18n();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationId, setApplicationId] = useState(null);
  
  // Calculator state
  const [amount, setAmount] = useState(10000000);
  const [term, setTerm] = useState(12);
  const [calcResult, setCalcResult] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    agreedToTerms: false,
    phone: '',
    smsCode: '',
    firstName: '',
    lastName: '',
    passportUploaded: false,
    registrationUploaded: false,
    myIdVerified: false,
  });

  const steps = [
    { title: t('application.step1.title'), desc: t('application.step1.desc') },
    { title: t('application.step2.title'), desc: t('application.step2.desc') },
    { title: t('application.step3.title'), desc: t('application.step3.desc') },
    { title: t('application.step4.title'), desc: t('application.step4.desc') },
    { title: t('application.step5.title'), desc: t('application.step5.desc') },
    { title: t('application.step6.title'), desc: t('application.step6.desc') },
  ];

  const terms = [3, 6, 12, 18, 24, 36, 48, 60];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${slug}`);
        setProduct(response.data);
        setAmount(response.data.min_amount);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  useEffect(() => {
    if (!product) return;
    
    const calculate = async () => {
      try {
        const response = await axios.post(`${API}/calculator`, {
          amount,
          term,
          rate: product.rate
        });
        setCalcResult(response.data);
      } catch (error) {
        console.error('Calculation error:', error);
      }
    };
    
    const debounce = setTimeout(calculate, 300);
    return () => clearTimeout(debounce);
  }, [amount, term, product]);

  const getName = (p) => p?.[`name_${locale}`] || p?.name_ru;
  const getDescription = (p) => p?.[`description_${locale}`] || p?.description_ru;
  const getFeatures = (p) => p?.[`features_${locale}`] || p?.features_ru || [];

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!formData.agreedToTerms) {
        toast.error('Пожалуйста, согласитесь с условиями');
        return;
      }
    }
    
    if (currentStep === 1) {
      if (!formData.phone || formData.phone.length < 9) {
        toast.error('Введите корректный номер телефона');
        return;
      }
      if (formData.smsCode.length !== 6) {
        toast.error('Введите 6-значный код из SMS');
        return;
      }
      // Mock SMS verification
      toast.success('SMS код подтверждён');
    }
    
    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Заполните все поля');
        return;
      }
      
      // Create application
      try {
        const response = await axios.post(`${API}/applications`, {
          product_slug: slug,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          amount,
          term,
          agreed_to_terms: true
        });
        setApplicationId(response.data.id);
        toast.success('Данные сохранены');
      } catch (error) {
        toast.error('Ошибка при сохранении данных');
        return;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.passportUploaded || !formData.registrationUploaded) {
        toast.error('Загрузите все документы');
        return;
      }
      // Mock document upload
      if (applicationId) {
        await axios.post(`${API}/applications/${applicationId}/upload-documents`);
      }
      toast.success('Документы загружены');
    }
    
    if (currentStep === 4) {
      // Mock myID verification
      if (applicationId) {
        await axios.post(`${API}/applications/${applicationId}/verify-myid`);
      }
      setFormData(prev => ({ ...prev, myIdVerified: true }));
      toast.success('Идентификация пройдена');
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSendSMS = async () => {
    if (!formData.phone || formData.phone.length < 9) {
      toast.error('Введите номер телефона');
      return;
    }
    await axios.post(`${API}/applications/send-sms`, { phone: formData.phone });
    toast.success('SMS код отправлен (демо: любой 6-значный код)');
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="h-96 bg-muted rounded-3xl animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-background" data-testid="product-hero">
        <div className="max-w-7xl mx-auto container-padding">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Все продукты
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground" data-testid="product-title">
                {getName(product)}
              </h1>
              <p className="text-xl text-muted-foreground">
                {getDescription(product)}
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {getFeatures(product).map((feature, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary/10 text-secondary border-0 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">Без скрытых платежей</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">Решение за 1 день</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm">Договоры доступны</span>
                </div>
              </div>
            </div>

            {/* Product image */}
            <div className="relative">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d'}
                alt={getName(product)}
                className="w-full h-[300px] lg:h-[400px] object-cover rounded-3xl shadow-float"
                data-testid="product-image"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Сумма</p>
                    <p className="font-semibold text-foreground">{formatNumber(product.min_amount, locale)} - {formatNumber(product.max_amount, locale)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Срок</p>
                    <p className="font-semibold text-foreground">{product.min_term} - {product.max_term} мес</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ставка</p>
                    <p className="font-semibold text-secondary">{product.rate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator & Application */}
      <section className="section-padding" data-testid="product-application">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator */}
            <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="product-calculator">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{t('calculator.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>{t('calculator.amount')}</Label>
                    <span className="font-semibold text-primary">{formatCurrency(amount, locale)}</span>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={([v]) => setAmount(v)}
                    min={product.min_amount}
                    max={product.max_amount}
                    step={1000000}
                    data-testid="product-amount-slider"
                  />
                </div>

                {/* Term */}
                <div className="space-y-4">
                  <Label>{t('calculator.term')}</Label>
                  <Select value={term.toString()} onValueChange={(v) => setTerm(parseInt(v))}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.filter(t => t >= product.min_term && t <= product.max_term).map((t) => (
                        <SelectItem key={t} value={t.toString()}>
                          {t} {t('calculator.months')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results */}
                {calcResult && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('calculator.monthlyPayment')}</span>
                      <span className="text-2xl font-bold text-foreground">{formatCurrency(calcResult.monthly_payment, locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('calculator.totalOverpay')}</span>
                      <span className="text-lg font-semibold text-secondary">{formatCurrency(calcResult.overpayment, locale)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{t('calculator.disclaimer')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="application-form">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{t('application.title')}</CardTitle>
                {/* Progress */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Шаг {currentStep + 1} из {steps.length}</span>
                    <span className="font-medium text-foreground">{steps[currentStep]?.title}</span>
                  </div>
                  <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 0: Terms */}
                {currentStep === 0 && (
                  <div className="space-y-6" data-testid="step-0">
                    <p className="text-muted-foreground">{steps[0].desc}</p>
                    <div className="p-4 bg-muted/50 rounded-xl space-y-3 text-sm text-muted-foreground">
                      <p>• Ставка: {product.rate}% годовых</p>
                      <p>• Сумма: {formatNumber(product.min_amount, locale)} - {formatNumber(product.max_amount, locale)}</p>
                      <p>• Срок: {product.min_term} - {product.max_term} месяцев</p>
                      <p>• Без скрытых комиссий и платежей</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="agree"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreedToTerms: checked }))}
                        data-testid="agree-checkbox"
                      />
                      <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                        {t('application.step1.agree')}
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 1: SMS */}
                {currentStep === 1 && (
                  <div className="space-y-6" data-testid="step-1">
                    <p className="text-muted-foreground">{steps[1].desc}</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('application.step2.phone')}</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="+998 90 123 45 67"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="rounded-xl"
                            data-testid="phone-input"
                          />
                          <Button onClick={handleSendSMS} variant="outline" className="rounded-xl whitespace-nowrap">
                            {t('application.step2.sendCode')}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('application.step2.code')}</Label>
                        <Input 
                          placeholder="123456"
                          value={formData.smsCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, smsCode: e.target.value }))}
                          maxLength={6}
                          className="rounded-xl"
                          data-testid="sms-code-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <div className="space-y-6" data-testid="step-2">
                    <p className="text-muted-foreground">{steps[2].desc}</p>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>{t('application.step3.firstName')}</Label>
                        <Input 
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="rounded-xl"
                          data-testid="first-name-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('application.step3.lastName')}</Label>
                        <Input 
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="rounded-xl"
                          data-testid="last-name-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6" data-testid="step-3">
                    <p className="text-muted-foreground">{steps[3].desc}</p>
                    <div className="grid gap-4">
                      <div 
                        className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${formData.passportUploaded ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary'}`}
                        onClick={() => setFormData(prev => ({ ...prev, passportUploaded: true }))}
                        data-testid="passport-upload"
                      >
                        {formData.passportUploaded ? (
                          <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        )}
                        <p className="font-medium">{t('application.step4.passport')}</p>
                        <p className="text-xs text-muted-foreground">{t('application.step4.hint')}</p>
                      </div>
                      <div 
                        className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${formData.registrationUploaded ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary'}`}
                        onClick={() => setFormData(prev => ({ ...prev, registrationUploaded: true }))}
                        data-testid="registration-upload"
                      >
                        {formData.registrationUploaded ? (
                          <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        )}
                        <p className="font-medium">{t('application.step4.registration')}</p>
                        <p className="text-xs text-muted-foreground">{t('application.step4.hint')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: myID */}
                {currentStep === 4 && (
                  <div className="space-y-6" data-testid="step-4">
                    <p className="text-muted-foreground">{steps[4].desc}</p>
                    <div className="p-8 bg-muted/50 rounded-2xl text-center">
                      <Fingerprint className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-4">myID Идентификация</p>
                      <Button 
                        onClick={() => setFormData(prev => ({ ...prev, myIdVerified: true }))}
                        className="rounded-full bg-primary hover:bg-primary/90"
                        data-testid="myid-button"
                      >
                        {t('application.step5.button')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Success */}
                {currentStep === 5 && (
                  <div className="space-y-6 text-center py-8" data-testid="step-5">
                    <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-secondary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl font-bold text-foreground">{steps[5].title}</h3>
                      <p className="text-muted-foreground">{steps[5].desc}</p>
                    </div>
                    <Link to="/">
                      <Button className="rounded-full bg-primary hover:bg-primary/90">
                        {t('application.step6.back')}
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Navigation */}
                {currentStep < 5 && (
                  <div className="flex gap-3 pt-4">
                    {currentStep > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={handleBack}
                        className="rounded-full flex-1"
                        data-testid="back-button"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('application.back')}
                      </Button>
                    )}
                    <Button 
                      onClick={handleNext}
                      className="rounded-full flex-1 bg-primary hover:bg-primary/90"
                      data-testid="next-button"
                    >
                      {currentStep === 4 ? t('application.submit') : t('application.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;
