# GLINSO Website - Deployment Guide

Complete guide for deploying GLINSO website to production with custom domain and email integration.

## 📋 Pre-Deployment Checklist

- [ ] All content reviewed and approved
- [ ] Images optimized (WebP format, compressed)
- [ ] Video compressed (~2-3MB)
- [ ] Ambient music file added (`/public/audio/ambient.mp3`)
- [ ] Environment variables configured
- [ ] Contact form tested
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Automatic deployments from Git
- Built-in CDN and SSL
- Serverless functions for contact form
- Free tier available

#### Step-by-Step Deployment:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/glinso-website.git
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     EMAIL_FROM=noreply@glinso.ae
     EMAIL_TO=team@glinso.ae
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`

## 🌐 Custom Domain Setup

### DNS Configuration for glinso.ae

#### A Records (for root domain)
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel)
TTL: 3600
```

#### CNAME Records (for www)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Steps:

1. **Login to your domain registrar** (GoDaddy, Namecheap, etc.)

2. **Go to DNS Management**

3. **Add/Update Records:**
   - Delete any existing A/CNAME records for `@` and `www`
   - Add the records above

4. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter `glinso.ae` and `www.glinso.ae`
   - Follow verification steps

5. **Wait for DNS Propagation**
   - Usually takes 5-30 minutes
   - Can take up to 48 hours
   - Check status: [whatsmydns.net](https://whatsmydns.net)

6. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait for "Valid" status
   - Your site will be available at `https://glinso.ae`

## 📧 Email Service Setup (Contact Form)

### Using Resend (Recommended)

**Why Resend?**
- Built for developers
- Generous free tier (100 emails/day)
- Simple API
- Great deliverability
- UAE region support

#### Setup Steps:

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up with your email
   - Verify email address

2. **Get API Key**
   - Go to API Keys section
   - Click "Create API Key"
   - Name it "GLINSO Production"
   - Copy the key (starts with `re_`)
   - **Save it securely** - you can't see it again

3. **Add Domain to Resend**
   - Go to Domains section
   - Click "Add Domain"
   - Enter `glinso.ae`
   - Copy the DNS records shown

4. **Configure DNS for Email**

   Add these records to your domain:

   ```
   Type: TXT
   Name: @
   Value: resend._domainkey.glinso.ae
   ```

   ```
   Type: CNAME
   Name: resend._domainkey
   Value: [value provided by Resend]
   ```

   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```

5. **Verify Domain**
   - Wait 5-10 minutes for DNS propagation
   - Click "Verify" in Resend dashboard
   - Status should change to "Verified"

6. **Test Email Sending**
   - Use Resend's test feature
   - Send test email to `team@glinso.ae`
   - Check inbox and spam folder

### Alternative: SendGrid

If you prefer SendGrid:

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Update `.env` variables:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   EMAIL_FROM=noreply@glinso.ae
   EMAIL_TO=team@glinso.ae
   ```
4. Update API route to use SendGrid SDK

## 🔧 API Route for Contact Form

Create `/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, service, message } = body

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 📊 Analytics Setup (Optional)

### Google Analytics

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Add to `app/layout.tsx`:
   ```tsx
   <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
   ```

## 🔒 Security Headers

Add to `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
}
```

## 🎯 Post-Deployment

1. **Test Everything**
   - [ ] Homepage loads correctly
   - [ ] All pages accessible
   - [ ] Navigation works
   - [ ] Contact form sends emails
   - [ ] Music player works
   - [ ] Custom cursor on desktop
   - [ ] Responsive on mobile

2. **SEO**
   - [ ] Submit sitemap to Google Search Console
   - [ ] Verify meta tags
   - [ ] Check page load speed (aim for <3s)

3. **Monitor**
   - Set up Vercel Analytics
   - Monitor form submissions
   - Check error logs

## 🆘 Troubleshooting

### Domain not working
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Verify DNS records match exactly
- Wait up to 48 hours for full propagation

### Contact form not working
- Check API route logs in Vercel
- Verify RESEND_API_KEY is set
- Check Resend domain verification status
- Test with curl:
  ```bash
  curl -X POST https://glinso.ae/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test"}'
  ```

### SSL certificate issues
- Wait 5 minutes and refresh
- Check domain verification in Vercel
- Ensure CNAME points to Vercel

## 📞 Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to deploy?** Follow this guide step by step and your site will be live in ~30 minutes! 🚀
