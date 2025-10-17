# 🌐 Domain Setup Guide for totosbureau.com

## Step 1: Add Domain to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project (`fur-and-feather-shop-fresh`)

2. **Add Your Domain:**
   - Go to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `totosbureau.com`
   - Click **Add**

3. **Vercel will show you DNS settings** - keep this page open!

## Step 2: Configure DNS in GoDaddy

1. **Log into GoDaddy:**
   - Go to: https://dcc.godaddy.com/
   - Find `totosbureau.com` and click **DNS**

2. **Add These DNS Records:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 600

   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

3. **Remove any existing A records** for `@` and `www`

## Step 3: Wait for DNS Propagation

- DNS changes can take 5-60 minutes to propagate
- You can check status at: https://dnschecker.org/

## Step 4: Test Your Domain

Once DNS propagates, test:
- `https://totosbureau.com` (should redirect to www)
- `https://www.totosbureau.com` (main site)
- `https://www.totosbureau.com/checkout` (payment page)

## Step 5: Update Email Settings (Optional)

For professional email addresses:
1. **GoDaddy Email:**
   - Set up `hello@totosbureau.com`
   - Set up `support@totosbureau.com`

2. **Update Contact Forms:**
   - Update email addresses in your contact forms
   - Update SMTP settings if needed

## Troubleshooting

**If domain doesn't work:**
1. Check DNS propagation: https://dnschecker.org/
2. Wait up to 1 hour for full propagation
3. Clear browser cache
4. Try incognito/private browsing

**If SSL certificate issues:**
- Vercel automatically handles SSL
- Wait 5-10 minutes after DNS propagation

## Next Steps

Once domain is working:
1. Update social media links
2. Update business cards/marketing materials
3. Set up Google Analytics
4. Submit to search engines
5. Set up professional email addresses

## Support

If you need help:
- Vercel Support: https://vercel.com/support
- GoDaddy Support: https://www.godaddy.com/help
- Check DNS status: https://dnschecker.org/
