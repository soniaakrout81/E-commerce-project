# Client Handoff Checklist

## Branding
- Update store name in admin settings
- Upload logo and hero image
- Configure homepage banners
- Review primary, secondary, and accent colors
- Confirm footer contact details and social links

## Catalog
- Add products and verify categories
- Review product descriptions, keywords, and pricing
- Check stock values before launch

## Promotions
- Create active coupon codes
- Verify expiry dates and minimum order amounts

## Orders
- Test checkout flow
- Test order tracking page with a real order id
- Confirm admin order update workflow

## SEO
- Replace placeholder domain in `Frontend/public/robots.txt`
- Replace placeholder URLs in `Frontend/public/sitemap.xml`
- Review homepage and product metadata

## Deployment
- Frontend: set `VITE_API_URL`
- Backend: set MongoDB, JWT, email, Cloudinary, and frontend URL env vars
- Deploy frontend to Vercel or Netlify
- Deploy backend to Railway
- Point domain and confirm CORS origin

## Final QA
- Mobile navbar
- Homepage banners
- Admin dashboard
- Coupons flow
- Contact information
- Product images
- Footer links
