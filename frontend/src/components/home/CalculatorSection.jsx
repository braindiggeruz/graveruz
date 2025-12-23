import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { formatCurrency } from '../../lib/utils';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CalculatorSection = () => {
  const { locale, t } = useI18n();
  const [amount, setAmount] = useState(10000000);
  const [term, setTerm] = useState(12);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const minAmount = 1000000;
  const maxAmount = 500000000;
  const terms = [3, 6, 12, 18, 24, 36, 48, 60];

  useEffect(() => {
    const calculate = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${API}/calculator`, {
          amount,
          term,
          rate: 24.0
        });
        setResult(response.data);
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(calculate, 300);
    return () => clearTimeout(debounce);
  }, [amount, term]);

  return (
    <section className="section-padding" data-testid="calculator-section">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
                data-testid="calculator-title"
              >
                {t('calculator.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                Подберите оптимальные условия кредитования для вашего бизнеса
              </p>
            </div>

            {/* Calculator Card */}
            <Card className="bg-white rounded-3xl shadow-card border-0" data-testid="calculator-card">
              <CardHeader className="p-6 pb-0">
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  {t('calculator.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Amount Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">{t('calculator.amount')}</label>
                    <span className="text-lg font-semibold text-primary" data-testid="calc-amount-display">
                      {formatCurrency(amount, locale)}
                    </span>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={([value]) => setAmount(value)}
                    min={minAmount}
                    max={maxAmount}
                    step={1000000}
                    className="py-4"
                    data-testid="calc-amount-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(minAmount, locale)}</span>
                    <span>{formatCurrency(maxAmount, locale)}</span>
                  </div>
                </div>

                {/* Term Select */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">{t('calculator.term')}</label>
                  <Select value={term.toString()} onValueChange={(v) => setTerm(parseInt(v))}>
                    <SelectTrigger className="rounded-xl h-12" data-testid="calc-term-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((t) => (
                        <SelectItem key={t} value={t.toString()}>
                          {t} {locale === 'ru' ? 'месяцев' : locale === 'uz' ? 'oy' : 'months'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results */}
                {result && (
                  <div className="space-y-4 pt-4 border-t" data-testid="calc-results">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('calculator.monthlyPayment')}</span>
                      <span className="text-2xl font-bold text-foreground" data-testid="calc-monthly-payment">
                        {formatCurrency(result.monthly_payment, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('calculator.totalOverpay')}</span>
                      <span className="text-lg font-semibold text-secondary" data-testid="calc-overpayment">
                        {formatCurrency(result.overpayment, locale)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground" data-testid="calc-disclaimer">
                    {t('calculator.disclaimer')}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/products/business" className="flex-1">
                    <Button 
                      className="w-full rounded-full bg-primary hover:bg-primary/90"
                      data-testid="calc-apply-btn"
                    >
                      {t('calculator.apply')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/calculator">
                    <Button 
                      variant="outline" 
                      className="rounded-full border-primary text-primary hover:bg-primary/5"
                      data-testid="calc-details-btn"
                    >
                      {t('calculator.details')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                alt="Financial planning"
                className="w-full h-[500px] object-cover rounded-3xl"
                data-testid="calculator-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oasis-navy/40 to-transparent rounded-3xl" />
            </div>

            {/* Floating stats */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-float">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">24%</p>
                  <p className="text-xs text-muted-foreground">годовых</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">60</p>
                  <p className="text-xs text-muted-foreground">мес. макс</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">0%</p>
                  <p className="text-xs text-muted-foreground">комиссия</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
