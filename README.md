# GLINSO Brokers FZE - Official Website

**Engineering Global Certainty**

Independent insurance and reinsurance brokerage headquartered in Ras Al Khaimah, United Arab Emirates.

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.6 (App Router) with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Maps:** react-svg-worldmap
- **Fonts:** Cormorant Garamond (serif), Inter (sans), Geist Mono (mono)

## 📁 Project Structure

```
GlinsoWeb/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── story/               # Company story page
│   ├── team/                # Team page
│   ├── contact/             # Contact page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── hero-section.tsx    # Hero with video background
│   ├── video-background.tsx # Animated video background
│   ├── content-sections.tsx # Main content sections
│   ├── world-map.tsx       # Interactive world map
│   ├── glass-nav.tsx       # Navigation bar
│   ├── site-footer.tsx     # Footer
│   ├── phoenix-cursor.tsx  # Custom cursor
│   ├── ambient-music.tsx   # Music player
│   └── page-transition.tsx # Page transitions
├── public/
│   ├── video/              # Video assets
│   ├── images/             # Image assets
│   └── audio/              # Audio files
└── next.config.mjs         # Next.js configuration
```

## 🎨 Design System

### Colors
- **Primary:** HSL(28, 95%, 62%) - Orange
- **Secondary:** HSL(192, 45%, 65%) - Light Blue
- **Background:** HSL(210, 20%, 98%) - Light Gray
- **Foreground:** HSL(220, 15%, 20%) - Dark Gray

### Typography
- **Headings:** Cormorant Garamond (serif)
- **Body:** Inter (sans-serif)
- **Code/Labels:** Geist Mono (monospace)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd GlinsoWeb

# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
# Email Service (for contact form)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@glinso.ae
EMAIL_TO=team@glinso.ae

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📧 Contact Form Setup

The contact form requires an email service. Recommended: **Resend**

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`
4. Verify your domain at Resend

See `DEPLOYMENT.md` for detailed setup instructions.

## 🚢 Deployment

> **Production platform: [Vercel](https://vercel.com)**
> Vercel is connected to this repository and automatically deploys every push to `main`.
> CI (build + type-check + lint) runs via GitHub Actions on every push and pull request.

### Connect to Vercel (first time only)

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository
2. Framework will be auto-detected as **Next.js**
3. Add the environment variables below and click **Deploy**

### Environment Variables on Vercel

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key (from resend.com) |
| `CONTACT_TO` | Recipient email address (e.g. `team@glinso.ae`) |

Go to **Project Settings → Environment Variables** to set these.

### Custom Domain Setup (glinso.ae)

1. Add `glinso.ae` and `www.glinso.ae` in the Vercel dashboard under **Project Settings → Domains**
2. Update DNS records at your domain registrar:
   - **A record** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`
3. SSL certificate is provisioned automatically by Vercel

## 🎵 Adding Ambient Music

1. Download royalty-free music from:
   - [Free-Stock-Music](https://www.free-stock-music.com/ambient.html)
   - [Chosic](https://www.chosic.com/free-music/corporate/)

2. Convert to MP3 (recommended: 128kbps for web)

3. Place file at: `/public/audio/ambient.mp3`

4. Update volume in `components/ambient-music.tsx` if needed

## ⚡ Performance Optimizations

- **Video:** H.264, ~2-3MB, preload="metadata"
- **Images:** Next.js Image component with optimization
- **Animations:** 0.2s duration, hardware-accelerated
- **Prefetch:** All navigation links prefetch on hover
- **Code splitting:** Dynamic imports for heavy components

## 🔒 Security

- HTTPS enforced
- Content Security Policy headers
- No sensitive data in client-side code
- Email validation on server-side

## 📱 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Production preview
npm run start
```

## 📝 License

© 2026 GLINSO Brokers FZE. All rights reserved.

## 👥 Team

- **Managing Director:** Vasily Kozlov
- **CFO:** Svetlana Lisunova
- **Treaty Broker:** Veronica Bystrova

## 📞 Contact

- **Email:** team@glinso.ae
- **HQ:** Ras Al Khaimah, United Arab Emirates
- **Office:** Dubai, United Arab Emirates

---

Built with ❤️ using Next.js and React
