# NyayNow — Legal Help On-Demand 🏛️

An Uber-like app for on-demand legal services. Built with React + Vite.

---

## 🚀 Deploy FREE in under 2 minutes

### Option 1: Vercel (Recommended — Fastest)

1. **Push to GitHub:**
   ```bash
   cd nyaynow
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create nyaynow --public --push --source=.
   ```
   *(Or create a repo on github.com and push manually)*

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) → Sign in with GitHub
   - Click **"Add New Project"**
   - Import your `nyaynow` repo
   - Framework preset will auto-detect **Vite** — just click **Deploy**
   - ✅ Live in ~30 seconds at `nyaynow.vercel.app`

---

### Option 2: Netlify

1. Push to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com) → Sign in with GitHub
3. Click **"Add new site" → "Import an existing project"**
4. Select your repo
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy** → Live in ~1 minute

---

### Option 3: Cloudflare Pages

1. Push to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Create project → Connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy → Live with global CDN

---

### Option 4: GitHub Pages (No account needed beyond GitHub)

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/nyaynow/',
     plugins: [react()],
   })
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && npx gh-pages -d dist"
   ```

4. Run:
   ```bash
   npm run deploy
   ```

---

## 🛠 Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Tech Stack

- **React 18** + **Vite 5**
- Zero external UI dependencies
- Pure CSS animations
- Mobile-first responsive design
