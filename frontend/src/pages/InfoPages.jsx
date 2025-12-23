import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

// Public Info Page
export const PublicInfoPage = () => {
  const documents = [
    { title: 'Лицензия на осуществление микрофинансовой деятельности', type: 'PDF', size: '1.2 MB' },
    { title: 'Свидетельство о государственной регистрации', type: 'PDF', size: '0.8 MB' },
    { title: 'Устав организации', type: 'PDF', size: '2.1 MB' },
    { title: 'Правила предоставления микрозаймов', type: 'PDF', size: '1.5 MB' },
    { title: 'Тарифы и комиссии', type: 'PDF', size: '0.5 MB' },
  ];

  return (
    <Layout>
      <section className="section-padding" data-testid="public-info-page">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Публичная информация
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Документы и информация в соответствии с требованиями законодательства Республики Узбекистан
          </p>

          <div className="space-y-4" data-testid="documents-list">
            {documents.map((doc, index) => (
              <Card key={index} className="bg-white rounded-2xl border-0 shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full">
                    <Download className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-muted/30 rounded-3xl border-0">
            <CardContent className="p-8">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                Реквизиты организации
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Полное наименование</p>
                  <p className="font-medium text-foreground">ООО "Oasis Credit"</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ИНН</p>
                  <p className="font-medium text-foreground">123456789</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Юридический адрес</p>
                  <p className="font-medium text-foreground">г. Ташкент, ул. Амира Темура, 108</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Номер лицензии</p>
                  <p className="font-medium text-foreground">МФО-001234</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

// Financial Info Page
export const FinancialInfoPage = () => {
  const reports = [
    { title: 'Годовой отчет 2023', period: '2023', type: 'PDF', size: '3.5 MB' },
    { title: 'Квартальный отчет Q4 2023', period: 'Q4 2023', type: 'PDF', size: '1.8 MB' },
    { title: 'Квартальный отчет Q3 2023', period: 'Q3 2023', type: 'PDF', size: '1.6 MB' },
    { title: 'Квартальный отчет Q2 2023', period: 'Q2 2023', type: 'PDF', size: '1.7 MB' },
    { title: 'Аудиторское заключение 2023', period: '2023', type: 'PDF', size: '0.9 MB' },
  ];

  return (
    <Layout>
      <section className="section-padding" data-testid="financial-info-page">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Финансовая информация
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Финансовая отчётность и аудиторские заключения
          </p>

          <div className="space-y-4" data-testid="reports-list">
            {reports.map((report, index) => (
              <Card key={index} className="bg-white rounded-2xl border-0 shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.period} • {report.type} • {report.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full">
                    <Download className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Contracts Page
export const ContractsPage = () => {
  const contracts = [
    { title: 'Договор микрозайма для физических лиц', desc: 'Типовой договор для ФЛ', type: 'DOCX', size: '0.3 MB' },
    { title: 'Договор микрозайма для ИП', desc: 'Типовой договор для индивидуальных предпринимателей', type: 'DOCX', size: '0.4 MB' },
    { title: 'Договор микрозайма для юридических лиц', desc: 'Типовой договор для ЮЛ', type: 'DOCX', size: '0.4 MB' },
    { title: 'Договор поручительства', desc: 'Типовой договор поручительства', type: 'DOCX', size: '0.2 MB' },
    { title: 'Договор залога', desc: 'Типовой договор залога имущества', type: 'DOCX', size: '0.3 MB' },
  ];

  return (
    <Layout>
      <section className="section-padding" data-testid="contracts-page">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Шаблоны договоров
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Ознакомьтесь с типовыми формами договоров до подачи заявки
          </p>

          <Card className="bg-primary/5 border-primary/20 rounded-2xl mb-8">
            <CardContent className="p-6 flex items-start gap-4">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                Все договоры составлены в соответствии с законодательством Республики Узбекистан. 
                Фактические условия могут отличаться в зависимости от результатов скоринга.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4" data-testid="contracts-list">
            {contracts.map((contract, index) => (
              <Card key={index} className="bg-white rounded-2xl border-0 shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{contract.title}</h3>
                      <p className="text-sm text-muted-foreground">{contract.desc} • {contract.type} • {contract.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full">
                    <Download className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Privacy Page
export const PrivacyPage = () => {
  return (
    <Layout>
      <section className="section-padding" data-testid="privacy-page">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Политика конфиденциальности
          </h1>
          <p className="text-muted-foreground mb-8">
            Последнее обновление: 1 января 2024 года
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
              пользователей сайта Oasis Credit.
            </p>

            <h2>2. Сбор информации</h2>
            <p>
              Мы собираем информацию, которую вы предоставляете при заполнении форм на сайте: имя, номер телефона, 
              email, а также данные для идентификации через систему myID.
            </p>

            <h2>3. Использование информации</h2>
            <p>
              Собранная информация используется для обработки заявок на кредит, связи с клиентами и улучшения 
              качества обслуживания.
            </p>

            <h2>4. Защита данных</h2>
            <p>
              Мы принимаем все необходимые меры для защиты персональных данных от несанкционированного доступа, 
              изменения, раскрытия или уничтожения.
            </p>

            <h2>5. Передача данных третьим лицам</h2>
            <p>
              Персональные данные не передаются третьим лицам, за исключением случаев, предусмотренных 
              законодательством Республики Узбекистан.
            </p>

            <h2>6. Контакты</h2>
            <p>
              По вопросам обработки персональных данных обращайтесь по адресу: info@oasis.uz
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
