import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, Briefcase, Zap, Tractor, Car, User } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const productIcons = {
  business: Briefcase,
  tezkor: Zap,
  agro: Tractor,
  auto: Car,
  self_employed: User,
};

const ProductsSection = () => {
  const { locale, t } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getName = (product) => {
    return product[`name_${locale}`] || product.name_ru;
  };

  const getDescription = (product) => {
    return product[`description_${locale}`] || product.description_ru;
  };

  const getFeatures = (product) => {
    return product[`features_${locale}`] || product.features_ru;
  };

  if (loading) {
    return (
      <section className="section-padding bg-muted/30" data-testid="products-section-loading">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-muted rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30" data-testid="products-section">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            data-testid="products-title"
          >
            {t('products.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Products Grid - Bento Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
          {products.map((product, index) => {
            const Icon = productIcons[product.category] || Briefcase;
            const isLarge = index === 0 || index === 3;
            
            return (
              <Card 
                key={product.id}
                className={`group bg-white rounded-3xl border border-border/50 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 overflow-hidden ${isLarge ? 'lg:col-span-1' : ''}`}
                data-testid={`product-card-${product.slug}`}
              >
                <CardHeader className="p-6 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="outline" className="text-xs border-secondary text-secondary">
                      {product.rate}% годовых
                    </Badge>
                  </div>
                  <CardTitle className="font-heading text-xl font-semibold text-foreground">
                    {getName(product)}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {getDescription(product)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {getFeatures(product).slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={`/products/${product.slug}`}>
                    <Button 
                      variant="ghost" 
                      className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-colors"
                      data-testid={`product-btn-${product.slug}`}
                    >
                      {t('products.learnMore')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footnote */}
        <p className="text-center text-sm text-muted-foreground mt-8" data-testid="products-footnote">
          {t('products.footnote')}
        </p>
      </div>
    </section>
  );
};

export default ProductsSection;
