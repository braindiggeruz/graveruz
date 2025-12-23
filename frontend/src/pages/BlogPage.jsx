import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useI18n } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ArrowRight, Calendar, User, Search, Tag } from 'lucide-react';
import { truncateText } from '../lib/utils';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categories = [
  { id: 'all', label_ru: 'Все', label_uz: 'Hammasi', label_en: 'All' },
  { id: 'financial', label_ru: 'Финансовая грамотность', label_uz: 'Moliyaviy savodxonlik', label_en: 'Financial Literacy' },
  { id: 'business', label_ru: 'Рост бизнеса', label_uz: 'Biznes o\'sishi', label_en: 'Business Growth' },
  { id: 'selfEmployed', label_ru: 'Самозанятые', label_uz: "O'z-o'zini band qilganlar", label_en: 'Self-Employed' },
  { id: 'agro', label_ru: 'Агро', label_uz: 'Agro', label_en: 'Agro' },
  { id: 'stories', label_ru: 'Истории', label_uz: 'Hikoyalar', label_en: 'Stories' },
  { id: 'news', label_ru: 'Новости', label_uz: 'Yangiliklar', label_en: 'News' },
];

const BlogPage = () => {
  const { locale, t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = activeCategory === 'all' 
          ? `${API}/blog`
          : `${API}/blog?category=${activeCategory}`;
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]);

  const getTitle = (post) => post[`title_${locale}`] || post.title_ru;
  const getExcerpt = (post) => post[`excerpt_${locale}`] || post.excerpt_ru;
  const getCategoryLabel = (cat) => cat[`label_${locale}`] || cat.label_ru;

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const title = getTitle(post).toLowerCase();
    const excerpt = getExcerpt(post).toLowerCase();
    return title.includes(searchQuery.toLowerCase()) || excerpt.includes(searchQuery.toLowerCase());
  });

  return (
    <Layout>
      <section className="section-padding" data-testid="blog-page">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              data-testid="blog-title"
            >
              {t('blog.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Поиск статей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 rounded-full h-12"
                data-testid="blog-search"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8" data-testid="blog-categories">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                className={`rounded-full ${activeCategory === cat.id ? 'bg-primary' : 'border-border'}`}
                onClick={() => setActiveCategory(cat.id)}
                data-testid={`category-${cat.id}`}
              >
                {getCategoryLabel(cat)}
              </Button>
            ))}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Статьи не найдены</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="blog-posts-grid">
              {filteredPosts.map((post, index) => (
                <Card 
                  key={post.id}
                  className={`group bg-white rounded-3xl border-0 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                  data-testid={`blog-post-${post.slug}`}
                >
                  <div className={`relative ${index === 0 ? 'h-64 lg:h-80' : 'h-48'}`}>
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f'}
                      alt={getTitle(post)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-white border-0">
                      <Tag className="w-3 h-3 mr-1" />
                      {categories.find(c => c.id === post.category)?.[`label_${locale}`] || post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                      </span>
                    </div>
                    <h3 className={`font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors ${index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
                      {getTitle(post)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {truncateText(getExcerpt(post), index === 0 ? 200 : 100)}
                    </p>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-white p-0 h-auto">
                        {t('blog.readMore')}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

// Blog Article Page
export const BlogArticlePage = () => {
  const { slug } = useParams();
  const { locale, t } = useI18n();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API}/blog/${slug}`);
        setPost(response.data);
        
        // Fetch related posts
        const relatedResponse = await axios.get(`${API}/blog?category=${response.data.category}&limit=3`);
        setRelatedPosts(relatedResponse.data.filter(p => p.slug !== slug).slice(0, 3));
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="h-96 bg-muted rounded-3xl animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) return null;

  const getTitle = (p) => p?.[`title_${locale}`] || p?.title_ru;
  const getContent = (p) => p?.[`content_${locale}`] || p?.content_ru;
  const getExcerpt = (p) => p?.[`excerpt_${locale}`] || p?.excerpt_ru;

  return (
    <Layout>
      <article className="section-padding" data-testid="blog-article">
        <div className="max-w-4xl mx-auto container-padding">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            ← Все статьи
          </Link>

          {/* Header */}
          <header className="mb-8 space-y-4">
            <Badge className="bg-primary/10 text-primary border-0">
              {categories.find(c => c.id === post.category)?.[`label_${locale}`] || post.category}
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" data-testid="article-title">
              {getTitle(post)}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t('blog.updated')}: {new Date(post.updated_at).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
              </span>
            </div>
          </header>

          {/* Image */}
          <div className="rounded-3xl overflow-hidden mb-8">
            <img 
              src={post.image_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f'}
              alt={getTitle(post)}
              className="w-full h-[300px] md:h-[400px] object-cover"
              data-testid="article-image"
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            data-testid="article-content"
          >
            {getContent(post).split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={i} className="ml-4">{paragraph.slice(2)}</li>;
              }
              if (paragraph.trim()) {
                return <p key={i} className="mb-4">{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {/* CTA */}
          <Card className="bg-primary text-white rounded-3xl border-0 mt-12 p-8 text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Рассчитайте кредит под ваш сценарий</h3>
            <Link to="/calculator">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 px-8" data-testid="article-cta">
                Перейти к калькулятору
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t('blog.relatedArticles')}</h2>
              <div className="grid md:grid-cols-3 gap-6" data-testid="related-posts">
                {relatedPosts.map((related) => (
                  <Card key={related.id} className="bg-white rounded-2xl border-0 shadow-card overflow-hidden">
                    <div className="h-32">
                      <img 
                        src={related.image_url || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f'}
                        alt={getTitle(related)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{getTitle(related)}</h4>
                      <Link to={`/blog/${related.slug}`}>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                          {t('blog.readMore')} →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPage;
