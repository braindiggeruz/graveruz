import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { formatCurrency, formatNumber } from '../lib/utils';
import { Calculator, Info, ArrowRight, TrendingUp, Percent, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CalculatorPage = () => {
  const { locale, t } = useI18n();
  const [amount, setAmount] = useState(50000000);
  const [term, setTerm] = useState(24);
  const [rate, setRate] = useState(24);
  const [paymentType, setPaymentType] = useState('annuity');
  const [result, setResult] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const minAmount = 1000000;
  const maxAmount = 1000000000;
  const terms = [3, 6, 12, 18, 24, 36, 48, 60];
  const rates = [20, 22, 24, 26, 28, 30];

  useEffect(() => {
    const calculate = async () => {
      try {
        const response = await axios.post(`${API}/calculator`, {
          amount,
          term,
          rate
        });
        setResult(response.data);
        
        // Generate payment schedule
        const monthlyRate = rate / 100 / 12;
        const newSchedule = [];
        let remaining = amount;
        
        for (let i = 1; i <= term; i++) {
          const interest = remaining * monthlyRate;
          let principal;
          let payment;
          
          if (paymentType === 'annuity') {
            payment = response.data.monthly_payment;
            principal = payment - interest;
          } else {
            // Differential
            principal = amount / term;
            payment = principal + interest;
          }
          
          remaining -= principal;
          
          newSchedule.push({
            month: i,
            payment: Math.round(payment),
            principal: Math.round(principal),
            interest: Math.round(interest),
            remaining: Math.max(0, Math.round(remaining))
          });
        }
        
        setSchedule(newSchedule.slice(0, 6));
      } catch (error) {
        console.error('Calculation error:', error);
      }
    };
    
    const debounce = setTimeout(calculate, 300);
    return () => clearTimeout(debounce);
  }, [amount, term, rate, paymentType]);

  return (
    <Layout>
      <section className="section-padding" data-testid="calculator-page">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              data-testid="calculator-page-title"
            >
              Кредитный калькулятор
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Рассчитайте оптимальные условия кредитования и отправьте заявку
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="calculator-form">
                <CardHeader>
                  <CardTitle className="font-heading text-xl flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Параметры кредита
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Amount */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Сумма кредита</Label>
                      <span className="text-2xl font-bold text-primary" data-testid="amount-display">
                        {formatCurrency(amount, locale)}
                      </span>
                    </div>
                    <Slider
                      value={[amount]}
                      onValueChange={([v]) => setAmount(v)}
                      min={minAmount}
                      max={maxAmount}
                      step={5000000}
                      className="py-4"
                      data-testid="amount-slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(minAmount, locale)}</span>
                      <span>{formatNumber(maxAmount, locale)}</span>
                    </div>
                  </div>

                  {/* Term */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Срок кредита</Label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {terms.map((t) => (
                        <Button
                          key={t}
                          variant={term === t ? 'default' : 'outline'}
                          className={`rounded-xl ${term === t ? 'bg-primary' : ''}`}
                          onClick={() => setTerm(t)}
                          data-testid={`term-${t}`}
                        >
                          {t} мес
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Процентная ставка</Label>
                    <Select value={rate.toString()} onValueChange={(v) => setRate(parseInt(v))}>
                      <SelectTrigger className="rounded-xl h-12" data-testid="rate-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rates.map((r) => (
                          <SelectItem key={r} value={r.toString()}>
                            {r}% годовых
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Type */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Тип платежей</Label>
                    <RadioGroup value={paymentType} onValueChange={setPaymentType} className="grid grid-cols-2 gap-4">
                      <div 
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${paymentType === 'annuity' ? 'border-primary bg-primary/5' : 'border-border'}`}
                        onClick={() => setPaymentType('annuity')}
                        data-testid="annuity-option"
                      >
                        <RadioGroupItem value="annuity" id="annuity" />
                        <div>
                          <Label htmlFor="annuity" className="cursor-pointer font-medium">Аннуитетные</Label>
                          <p className="text-xs text-muted-foreground">Равные платежи</p>
                        </div>
                      </div>
                      <div 
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${paymentType === 'differential' ? 'border-primary bg-primary/5' : 'border-border'}`}
                        onClick={() => setPaymentType('differential')}
                        data-testid="differential-option"
                      >
                        <RadioGroupItem value="differential" id="differential" />
                        <div>
                          <Label htmlFor="differential" className="cursor-pointer font-medium">Дифференцированные</Label>
                          <p className="text-xs text-muted-foreground">Убывающие платежи</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Schedule Preview */}
              <Card className="bg-white rounded-3xl border-0 shadow-card" data-testid="schedule-preview">
                <CardHeader>
                  <CardTitle className="font-heading text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    График платежей (первые 6 месяцев)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-medium text-muted-foreground">Месяц</th>
                          <th className="text-right py-3 font-medium text-muted-foreground">Платёж</th>
                          <th className="text-right py-3 font-medium text-muted-foreground">Основной долг</th>
                          <th className="text-right py-3 font-medium text-muted-foreground">Проценты</th>
                          <th className="text-right py-3 font-medium text-muted-foreground">Остаток</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.month} className="border-b border-dashed">
                            <td className="py-3">{row.month}</td>
                            <td className="text-right font-medium">{formatCurrency(row.payment, locale)}</td>
                            <td className="text-right text-muted-foreground">{formatCurrency(row.principal, locale)}</td>
                            <td className="text-right text-secondary">{formatCurrency(row.interest, locale)}</td>
                            <td className="text-right text-muted-foreground">{formatCurrency(row.remaining, locale)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Sidebar */}
            <div className="space-y-6">
              <Card className="bg-primary text-white rounded-3xl border-0 shadow-float sticky top-24" data-testid="calculator-results">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-white/80">Ежемесячный платёж</p>
                    <p className="text-4xl font-bold" data-testid="monthly-payment-result">
                      {result ? formatCurrency(result.monthly_payment, locale) : '—'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between">
                      <span className="text-white/80">Сумма кредита</span>
                      <span className="font-semibold">{formatCurrency(amount, locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Срок</span>
                      <span className="font-semibold">{term} мес</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Ставка</span>
                      <span className="font-semibold">{rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Переплата</span>
                      <span className="font-semibold text-accent">
                        {result ? formatCurrency(result.overpayment, locale) : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Общая сумма</span>
                      <span className="font-semibold">
                        {result ? formatCurrency(result.total_payment, locale) : '—'}
                      </span>
                    </div>
                  </div>

                  <Link to="/products/business">
                    <Button 
                      className="w-full rounded-full bg-white text-primary hover:bg-white/90 py-6 text-lg"
                      data-testid="apply-from-calculator"
                    >
                      Подать заявку
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <div className="flex items-start gap-2 p-3 bg-white/10 rounded-xl">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/80">
                      {t('calculator.disclaimer')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white rounded-2xl border-0 shadow-card">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">0%</p>
                    <p className="text-xs text-muted-foreground">Комиссия</p>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl border-0 shadow-card">
                  <CardContent className="p-4 text-center">
                    <Percent className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{rate}%</p>
                    <p className="text-xs text-muted-foreground">Годовых</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CalculatorPage;
