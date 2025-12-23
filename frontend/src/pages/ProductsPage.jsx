import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowRight, Briefcase, Zap, Tractor, Car, User, Filter } from 'lucide-react';
import { formatNumber } from '../lib/utils';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const productIcons = {
  business: Briefcase,
  tezkor: Zap,
  agro: Tractor,
  auto: Car,
  self_employed: User,
};

const categories = [
  { id: 'all', label_ru: 'Все', label_uz: 'Hammasi', label_en: 'All' },
  { id: 'business', label_ru: 'Бизнес', label_uz: 'Biznes', label_en: 'Business' },
  { id: 'tezkor', label_ru: 'Tezkor', label_uz: 'Tezkor', label_en: 'Tezkor' },
  { id: 'agro', label_ru: 'Агро', label_uz: 'Agro', label_en: 'Agro' },
  { id: 'auto', label_ru: 'Под залог', label_uz: 'Garov', label_en: 'Pledge' },
  { id: 'self_employed', label_ru: 'Самозанятым', label_uz: "O'z-o'zini band", label_en: 'Self-employed' },
];

const ProductsPage = () => {
  const { locale, t } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = activeCategory === 'all' 
          ? `${API}/products`
          : `${API}/products?category=${activeCategory}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const getName = (product) => product[`name_${locale}`] || product.name_ru;
  const getDescription = (product) => product[`description_${locale}`] || product.description_ru;
  const getFeatures = (product) => product[`features_${locale}`] || product.features_ru;
  const getCategoryLabel = (cat) => cat[`label_${locale}`] || cat.label_ru;

  return (
    <Layout>
      <section className="section-padding" data-testid="products-page">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              data-testid="products-page-title"
            >
              {t('products.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12" data-testid="products-filters">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                className={`rounded-full ${activeCategory === cat.id ? 'bg-primary' : 'border-border'}`}
                onClick={() => setActiveCategory(cat.id)}
                data-testid={`filter-${cat.id}`}
              >
                {getCategoryLabel(cat)}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" data-testid="products-list">
              {products.map((product) => {
                const Icon = productIcons[product.category] || Briefcase;
                return (
                  <Card 
                    key={product.id}
                    className="group bg-white rounded-3xl border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
                    data-testid={`product-${product.slug}`}
                  >
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <Badge variant="outline" className="text-xs border-secondary text-secondary">
                          {product.rate}%
                        </Badge>
                      </div>
                      <CardTitle className="font-heading text-xl font-semibold">
                        {getName(product)}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {getDescription(product)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4">
                      <ul className="space-y-2 mb-6">
                        {getFeatures(product).slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex gap-2 text-sm text-muted-foreground mb-4">
                        <span>Сумма: {formatNumber(product.min_amount, locale)} - {formatNumber(product.max_amount, locale)}</span>
                      </div>

                      <Link to={`/products/${product.slug}`}>
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
                          {t('products.learnMore')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Comparison Table */}
          <div className="mt-16" data-testid="comparison-section">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Сравнение продуктов
            </h2>
            <div className="overflow-x-auto">
              <Table className="bg-white rounded-2xl overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-heading font-semibold">Продукт</TableHead>
                    <TableHead className="font-heading font-semibold">Сумма</TableHead>
                    <TableHead className="font-heading font-semibold">Срок</TableHead>
                    <TableHead className="font-heading font-semibold">Ставка</TableHead>
                    <TableHead className="font-heading font-semibold">Для кого</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} data-testid={`table-row-${product.slug}`}>
                      <TableCell className="font-medium">{getName(product)}</TableCell>
                      <TableCell>{formatNumber(product.min_amount, locale)} - {formatNumber(product.max_amount, locale)}</TableCell>
                      <TableCell>{product.min_term} - {product.max_term} мес</TableCell>
                      <TableCell>{product.rate}%</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{getFeatures(product)[0]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footnote */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {t('products.footnote')}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ProductsPage;
