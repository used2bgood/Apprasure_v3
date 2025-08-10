How to use this folder

1) Place the entire 'public' folder at the root of your project (same level as package.json).
2) Commit and push:
   git add public/_headers public/_redirects
   git commit -m "Add CSP for /embed and SPA redirects"
   git push

What it does
- _headers: Sets Content-Security-Policy on the /embed path so your app can be iframed by https://apprasure.com.
- _redirects: Ensures SPA routing (any path returns index.html), required for /embed to work on refresh.

Change CSP scope (optional)
- If you want CSP to apply to ALL routes, edit public/_headers to:
  /*
    Content-Security-Policy: frame-ancestors 'self' https://apprasure.com;
