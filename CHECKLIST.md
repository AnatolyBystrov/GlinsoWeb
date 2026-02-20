# Pre-Deployment Checklist

## 📋 Content & Assets

- [ ] All text content reviewed and approved
- [ ] Contact email addresses verified (team@glinso.ae)
- [ ] Team member information up to date
- [ ] Office addresses correct
- [ ] Video file added (`/public/video/hero-bg.mp4`)
  - [ ] Compressed to ~2-3MB
  - [ ] H.264 format
  - [ ] Tests on mobile devices
- [ ] World map image added (`/public/images/woldwide.png`)
- [ ] Ambient music file added (`/public/audio/ambient.mp3`) - Optional
  - [ ] MP3 format, 128kbps
  - [ ] ~3-5 minutes long
  - [ ] Loops seamlessly

## 🔧 Configuration

- [ ] `.env.local` created with all required variables
  - [ ] `RESEND_API_KEY` set
  - [ ] `EMAIL_FROM` set to noreply@glinso.ae
  - [ ] `EMAIL_TO` set to team@glinso.ae
- [ ] Resend account created
- [ ] Resend API key generated
- [ ] Domain added to Resend (if using custom domain)

## 🧪 Testing

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Hero video plays/displays
- [ ] All navigation links work
- [ ] Story page displays correctly
- [ ] Team page shows all members
- [ ] Contact form submission works
- [ ] Email received after form submission
- [ ] Music player button works
- [ ] Custom cursor displays on desktop
- [ ] World map displays correctly
- [ ] Scroll indicator animates

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Video loads without blocking
- [ ] Animations run smoothly
- [ ] No console errors
- [ ] Lighthouse score > 90

## 🚀 Deployment

### Pre-Deployment
- [ ] Code pushed to Git repository
- [ ] All sensitive data in `.env` (not in code)
- [ ] `.env.example` updated
- [ ] Documentation complete (README, DEPLOYMENT, SETUP)
- [ ] Build test passes (`npm run build`)
- [ ] Type checking passes

### Vercel Setup
- [ ] Project created on Vercel
- [ ] Repository connected
- [ ] Environment variables added
  - [ ] RESEND_API_KEY
  - [ ] EMAIL_FROM
  - [ ] EMAIL_TO
- [ ] Build settings configured
- [ ] Deploy successful

### Domain Setup
- [ ] Custom domain purchased
- [ ] DNS records configured
  - [ ] A record for @ pointing to Vercel
  - [ ] CNAME for www pointing to Vercel
- [ ] Domain added in Vercel
- [ ] SSL certificate issued
- [ ] Domain propagated (check whatsmydns.net)

### Email Setup (Resend)
- [ ] Domain verified in Resend
- [ ] DNS records added for email
  - [ ] SPF record
  - [ ] DKIM record
  - [ ] resend._domainkey CNAME
- [ ] Test email sent successfully
- [ ] Email deliverability verified

## 🔒 Security

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in client code
- [ ] API routes have input validation
- [ ] Rate limiting considered (if needed)
- [ ] CORS configured correctly

## 📊 Post-Deployment

### Verification
- [ ] Live site accessible at custom domain
- [ ] All pages load correctly
- [ ] Contact form sends real emails
- [ ] No console errors in production
- [ ] Mobile experience verified
- [ ] Email template looks good

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured
- [ ] Form submissions monitored
- [ ] Email delivery monitored

### SEO (Optional)
- [ ] Google Search Console set up
- [ ] Sitemap submitted
- [ ] Meta tags verified
- [ ] Social media preview tested

## 📞 Handoff

- [ ] Documentation provided to client
- [ ] Access credentials shared (if applicable)
- [ ] Support plan discussed
- [ ] Training provided (if needed)

## 🎉 Launch

- [ ] Final approval from stakeholders
- [ ] Announcement prepared
- [ ] Social media posts ready
- [ ] **GO LIVE!** 🚀

---

**Notes:**
- Cross off items as you complete them
- If you encounter issues, refer to DEPLOYMENT.md
- Test thoroughly before going live
- Keep a backup of all credentials

**Estimated Time:** 2-3 hours for first deployment

Good luck! 🍀
