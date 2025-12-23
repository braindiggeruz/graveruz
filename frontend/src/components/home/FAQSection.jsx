import { useI18n } from '../../lib/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const FAQSection = () => {
  const { t, translations } = useI18n();

  const faqItems = translations?.faq?.items || [];

  return (
    <section className="section-padding" data-testid="faq-section">
      <div className="max-w-4xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            data-testid="faq-title"
          >
            {t('faq.title')}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-2xl border border-border/50 shadow-sm px-6 data-[state=open]:shadow-card transition-shadow"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="py-6 text-left font-heading font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
