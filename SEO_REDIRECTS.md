# SEO Redirect Rules (Server-Side)

Use these rules as a starting point for server-side 301 redirects.
Only apply the section that matches your hosting platform.

## Nginx

```
# Lighters legacy slugs -> canonical /products/lighters
rewrite ^/ru/lighters-engraving/?$ /ru/products/lighters permanent;
rewrite ^/uz/gravirovkali-zajigalka/?$ /uz/products/lighters permanent;

# Legacy blog paths
rewrite ^/blog/?$ /ru/blog permanent;
rewrite ^/blog/ru/?$ /ru/blog permanent;
rewrite ^/blog/uz/?$ /uz/blog permanent;
rewrite ^/blog/ru/(.*)$ /ru/blog/$1 permanent;
rewrite ^/blog/uz/(.*)$ /uz/blog/$1 permanent;
```

## Netlify (_redirects)

```
/ru/lighters-engraving    /ru/products/lighters    301
/uz/gravirovkali-zajigalka /uz/products/lighters   301

/blog        /ru/blog     301
/blog/ru     /ru/blog     301
/blog/uz     /uz/blog     301
/blog/ru/:slug  /ru/blog/:slug  301
/blog/uz/:slug  /uz/blog/:slug  301
```

## Vercel (vercel.json)

```
{
  "redirects": [
    { "source": "/ru/lighters-engraving", "destination": "/ru/products/lighters", "permanent": true },
    { "source": "/uz/gravirovkali-zajigalka", "destination": "/uz/products/lighters", "permanent": true },
    { "source": "/blog", "destination": "/ru/blog", "permanent": true },
    { "source": "/blog/ru", "destination": "/ru/blog", "permanent": true },
    { "source": "/blog/uz", "destination": "/uz/blog", "permanent": true },
    { "source": "/blog/ru/:slug", "destination": "/ru/blog/:slug", "permanent": true },
    { "source": "/blog/uz/:slug", "destination": "/uz/blog/:slug", "permanent": true }
  ]
}
```

## Cloudflare (Bulk Redirects)

```
Source URL,Target URL,Status
/ru/lighters-engraving,/ru/products/lighters,301
/uz/gravirovkali-zajigalka,/uz/products/lighters,301
/blog,/ru/blog,301
/blog/ru,/ru/blog,301
/blog/uz,/uz/blog,301
/blog/ru/(.*),/ru/blog/$1,301
/blog/uz/(.*),/uz/blog/$1,301
```
