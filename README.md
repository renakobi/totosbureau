# Toto's Bureau - Premium Pet Care & Supplies

A modern, full-featured e-commerce platform for premium pet products, built with React, and TypeScript.

### Prerequisites
- Node.js 16+ and npm
- Git
- A Gmail account (for SMTP email functionality)
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/renakobi/totosbureau.git
cd totosbureau
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Start the email server (in a separate terminal):**
```bash
node working-email-server.cjs
```

The application will be available at `http://localhost:8080`

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **Stripe Elements** - Payment UI components

### Backend Services
- **Node.js** - Email server runtime
- **Express** - Backend framework
- **Nodemailer** - Email sending
- **Stripe API** - Payment processing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend hosting
- **GitHub** - Version control
- **GoDaddy** - Domain management

##  Project Structure

```
totosbureau/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation bar
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Hero.tsx        # Landing page hero
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── Shop.tsx        # Product listing
│   │   ├── Checkout.tsx    # Checkout flow
│   │   ├── Admin.tsx       # Admin panel
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # User authentication
│   │   ├── CartContext.tsx # Shopping cart
│   │   ├── ProductContext.tsx # Product management
│   │   └── ...
│   ├── lib/                # Utility libraries
│   │   ├── stripe.ts       # Stripe configuration
│   │   └── utils.ts        # Helper functions
│   ├── assets/             # Images and static files
│   └── index.css           # Global styles
├── api/                    # Vercel serverless functions
├── public/                 # Public static assets
├── working-email-server.cjs # Email backend server
└── vercel.json            # Vercel configuration

```

##  Design System

### Color Palette
- **Primary Green**: `#9aedb6` - Main brand color
- **Forest Green**: `#50957d` - Secondary brand color
- **Orange**: `#fd9f48` - Accent color
- **Yellow**: `#ffbd59` - Highlight color
- **Teal**: `#09cba2` - Interactive elements

### Typography
- **Font Family**: Inter, Poppins, system-ui
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Responsive scaling** for mobile and desktop

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

##  Security & Environment Variables

### Required Environment Variables

#### `.env` (Local Development)
```env
# Email Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

#### Vercel Environment Variables
Add these in your Vercel project settings:
- `SMTP_USER` - Your Gmail address
- `SMTP_PASS` - Gmail app password
- `STRIPE_SECRET_KEY` - Stripe secret key

### Gmail App Password Setup
1. Go to https://myaccount.google.com/apppasswords
2. Create a new app password for "Mail"
3. Copy the 16-character password
4. Add to `.env` file

##  Stripe Payment Integration

### Test Mode (Development)
The application is configured with test mode by default:
- **Test Cards**: Use `4242 4242 4242 4242` (Visa)
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### Live Mode (Production)
1. Complete Stripe account verification
2. Add bank account for payouts
3. Get live API keys from Stripe Dashboard
4. Update `src/lib/stripe.ts` with live publishable key
5. Update environment variables with live secret key

### Payment Flow
1. User adds items to cart
2. Proceeds to checkout
3. Enters payment details (Stripe Elements)
4. Backend creates payment intent
5. Payment is confirmed
6. Order confirmation email sent
7. Admin notification email sent

## Email System

### Email Service
Uses **Nodemailer** with Gmail SMTP for:
- Order confirmation emails to customers
- Order notification emails to admin
- Payment receipts

### Email Templates
- **Order Confirmation**: Sent to customer with order details
- **Admin Notification**: Sent to store owner with new order info

### Email Server
The `working-email-server.cjs` handles:
- Payment intent creation
- Email sending via SMTP
- CORS configuration for frontend requests

## Admin Panel

Access at `/admin` (requires admin login)

### Features
- **Dashboard Analytics**: Revenue, orders, user growth
- **Product Management**: Add, edit, delete products
- **CSV Upload**: Bulk product import
- **User Management**: View and manage users
- **Category Management**: Organize product categories
- **Order Management**: View and update order status
- **Discount Management**: Create and manage discounts

### CSV Product Upload
Upload multiple products at once using CSV format:

**Required columns:**
```csv
name,description,price,originalPrice,category,subcategory,type,image,badge,stockQuantity,flavors,ingredients,aboutProduct
```

**Example:**
```csv
Premium Dog Food,High-quality nutrition,45.99,59.99,dogs,food,dry food,image.jpg,Best Seller,100,Chicken;Beef,Chicken meal,Premium formula
```

**Rules:**
- First row must be header with exact column names
- Separate multiple flavors with semicolons (`;`)
- Use lowercase for category/subcategory/type
- No currency symbols in prices

##  Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Add Environment Variables:**
Go to Vercel Dashboard → Project → Settings → Environment Variables

### Custom Domain Setup (totosbureau.com)

#### GoDaddy DNS Configuration:
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

#### Vercel Configuration:
1. Go to Project Settings → Domains
2. Add `totosbureau.com`
3. Add `www.totosbureau.com`
4. Wait for DNS propagation (5-60 minutes)

##  Features

### Customer Features
-  Product browsing and search
-  Shopping cart management
-  Secure checkout with Stripe
-  User authentication
-  Order history
-  Favorites/wishlist
-  Profile management
-  Responsive design
-  Light/dark mode

### Admin Features
-  Dashboard analytics
-  Product CRUD operations
-  CSV bulk upload
-  User management
-  Order management
-  Category management
-  Discount management
-  Real-time statistics

### Technical Features
-  TypeScript for type safety
-  Context API for state management
-  React Router for navigation
-  Tailwind CSS for styling
-  Responsive design
-  SEO optimization
-  Error boundaries
-  Loading states
-  Form validation
-  Accessibility features


##  API Documentation

### Email Server Endpoints

**Health Check:**
```
GET /api/health
Response: { status: "OK", message: "Working email server is running" }
```

**Create Payment Intent:**
```
POST /api/create-payment-intent
Body: { amount: number }
Response: { clientSecret: string }
```

**Send Payment Email:**
```
POST /api/send-payment-email
Body: {
  customerEmail: string,
  amount: number,
  paymentId: string,
  customerName: string,
  orderItems: array
}
Response: { success: boolean, message: string }
```


##  Roadmap


- [x] Basic e-commerce functionality
- [x] User authentication
- [x] Shopping cart
- [x] Stripe payment integration
- [x] Email notifications
- [x] Admin panel
- [x] CSV product upload
- [x] Responsive design
- [x] Custom domain setup

### In Progress 
- [ ] Advanced product filtering
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Inventory management

### Planned 
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Marketing integrations
- [ ] Social media integration
- [ ] Blog/content management
- [ ] Customer support chat
- [ ] Mobile app

##  Contact

**Website:** https://totosbureau.com  
**Email:** renakobeissi2004@gmail.com  
**GitHub:** https://github.com/renakobi/totosbureau

---

