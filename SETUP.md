# GLINSO Website - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Add Email Configuration (Required for Contact Form)

Get your Resend API key:
1. Go to [resend.com](https://resend.com) and sign up
2. Create an API key
3. Add to `.env.local`:

```env
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@glinso.ae
EMAIL_TO=team@glinso.ae
```

### 4. Add Ambient Music (Optional)

1. Download royalty-free music from [Free-Stock-Music](https://www.free-stock-music.com/ambient.html)
2. Convert to MP3 (128kbps recommended)
3. Save as `/public/audio/ambient.mp3`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Verify Everything Works

### Check Contact Form
1. Go to Contact page
2. Fill out form
3. Submit
4. Check email at `team@glinso.ae`

### Check All Features
- [ ] Homepage loads with video background
- [ ] Navigation works
- [ ] Music player button appears (bottom left)
- [ ] Custom cursor on desktop
- [ ] All pages load (Story, Team, Contact)
- [ ] Contact form works
- [ ] Scroll indicator animates
- [ ] World map displays

## 🐛 Common Issues

### "Cannot find module 'resend'"
```bash
npm install resend
```

### Contact form doesn't work
1. Check `.env.local` has `RESEND_API_KEY`
2. Verify domain at resend.com
3. Check browser console for errors

### Video doesn't play
1. Ensure `/public/video/hero-bg.mp4` exists
2. Video should be H.264 encoded
3. Max size ~2-3MB for good performance

### Music button doesn't work
1. Ensure `/public/audio/ambient.mp3` exists
2. Check browser console for errors
3. Try clicking button (autoplay blocked by browsers)

## 📁 Project Structure Quick Reference

```
/app
  ├── page.tsx              # Homepage
  ├── story/page.tsx        # Company story
  ├── team/page.tsx         # Team members
  ├── contact/page.tsx      # Contact form
  └── api/contact/route.ts  # Email API endpoint

/components
  ├── hero-section.tsx      # Hero with video
  ├── video-background.tsx  # Animated background
  ├── world-map.tsx         # Interactive map
  ├── glass-nav.tsx         # Navigation
  ├── ambient-music.tsx     # Music player
  └── site-footer.tsx       # Footer

/public
  ├── video/               # Video files
  ├── images/              # Images
  └── audio/               # Music files
```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 📝 Content Updates

### Update Team Members
Edit `/app/team/page.tsx`:
```typescript
const leadership = [
  {
    name: "Your Name",
    role: "Your Role",
    location: "Location",
    bio: "Bio text...",
  },
]
```

### Update Office Locations
Edit `/components/site-footer.tsx`:
```typescript
const offices = [
  {
    city: "City",
    address: "Address",
    detail: "Details",
    country: "Country"
  },
]
```

### Update Services
Edit `/components/content-sections.tsx`:
```typescript
const services = [
  {
    code: "01",
    name: "Service Name",
    desc: "Service description",
    color: "hsl(192 45% 65%)",
  },
]
```

## 🎨 Styling

### Colors
All colors defined in `/app/globals.css`:
- Primary: `hsl(28 95% 62%)` - Orange
- Secondary: `hsl(192 45% 65%)` - Light Blue
- Background: `hsl(210 20% 98%)` - Light Gray

### Fonts
- Headings: Cormorant Garamond (serif)
- Body: Inter (sans-serif)
- Code: Geist Mono (monospace)

## 📧 Email Template Customization

Edit `/app/api/contact/route.ts` to customize email HTML template.

## 🚀 Ready for Production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 📞 Need Help?

- Check [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Check browser console for errors
- Ensure all environment variables are set

---

**Happy coding!** 🎉
