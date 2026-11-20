# Yuanhang Wang — personal website

The source for my research and professional portfolio. The site is built with plain HTML, CSS and JavaScript, with no external runtime dependencies or analytics.

The public site is [aaron1128653.github.io](https://aaron1128653.github.io/). GitHub Actions builds `dist/` from the source files and deploys it to GitHub Pages when `main` changes.

## Preview locally

```powershell
node build.mjs
py -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.