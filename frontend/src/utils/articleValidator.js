export class ArticleValidator {
  static validateArticle(article) {
    const errors = [];

    if (!article || typeof article !== 'object') {
      return { isValid: false, errors: ['article: object is required'] };
    }

    if (!article.slug || typeof article.slug !== 'string') {
      errors.push('slug: non-empty string is required');
    }

    if (!article.title || typeof article.title !== 'string') {
      errors.push('title: non-empty string is required');
    }

    if (!article.description || typeof article.description !== 'string') {
      errors.push('description: non-empty string is required');
    }

    if (article.tags != null && !Array.isArray(article.tags)) {
      errors.push('tags: must be an array when present');
    }

    if (article.category != null && typeof article.category !== 'string') {
      errors.push('category: must be a string when present');
    }

    if (article.readingTime != null && typeof article.readingTime !== 'number') {
      errors.push('readingTime: must be a number when present');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAllArticles(articles) {
    if (!Array.isArray(articles)) {
      return {
        isValid: false,
        totalArticles: 0,
        validArticles: 0,
        invalidArticles: 0,
        errors: ['articles: array is required']
      };
    }

    const results = articles.map((article, index) => ({
      index,
      slug: article && article.slug,
      validation: this.validateArticle(article)
    }));

    const validArticles = results.filter((entry) => entry.validation.isValid).length;
    const invalidEntries = results.filter((entry) => !entry.validation.isValid);

    return {
      isValid: invalidEntries.length === 0,
      totalArticles: articles.length,
      validArticles,
      invalidArticles: invalidEntries.length,
      errors: invalidEntries.map((entry) => ({
        index: entry.index,
        slug: entry.slug,
        errors: entry.validation.errors
      }))
    };
  }

  static sanitizeArticle(article) {
    if (!article || typeof article !== 'object') return null;

    const cleanedTags = Array.isArray(article.tags)
      ? article.tags
        .map((tag) => String(tag || '').trim())
        .filter(Boolean)
      : [];

    return {
      ...article,
      slug: String(article.slug || '').trim(),
      title: String(article.title || '').trim(),
      description: String(article.description || '').trim(),
      category: article.category == null ? '' : String(article.category).trim(),
      tags: cleanedTags,
      readingTime: Number(article.readingTime) || 5
    };
  }

  static sanitizeAllArticles(articles) {
    if (!Array.isArray(articles)) return [];
    return articles.map((article) => this.sanitizeArticle(article)).filter(Boolean);
  }
}
