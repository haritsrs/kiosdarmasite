# KiosDarma Marketplace

Marketplace web application for KiosDarma ecosystem, connecting customers with merchants through a modern e-commerce platform.

## Features

- **Product Catalog**: Browse products from multiple merchants with real-time stock updates
- **Merchant Stores**: Visit individual merchant storefronts
- **Shopping Cart**: Add products to cart (single merchant per checkout)
- **Order Management**: Track orders and communicate with merchants via WhatsApp
- **User Authentication**: Firebase Authentication with role-based access
- **Support System**: Contact support via email form
- **Real-time Updates**: Firebase Realtime Database for live product and order updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Type Safety**: TypeScript
- **API**: Next.js API Routes
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Firebase project with Realtime Database enabled
- Firebase Authentication configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kiosdarma
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following environment variables (see `ENV_SETUP.md` for details):

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Email Service (Optional - for support form)
RESEND_API_KEY=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── orders/            # Order management page
│   ├── products/          # Product catalog pages
│   ├── stores/            # Merchant store pages
│   └── support/           # Support contact page
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── layout/           # Layout components
│   └── pages/            # Page-specific components
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   └── CartContext.tsx   # Shopping cart context
├── services/             # Service layer
│   ├── firebase/         # Firebase service modules
│   └── marketplace.ts    # Marketplace service
└── models/               # TypeScript type definitions
```

## Key Features

### Shopping Flow

1. **Browse Products**: View products from all merchants or filter by category/merchant
2. **Add to Cart**: Add products to cart (only one merchant per cart)
3. **Checkout**: Review order and send WhatsApp message to merchant
4. **Order Tracking**: Track order status and communicate with merchant

### Order Management

- Orders are created in Firebase Realtime Database
- Status updates sync in real-time
- WhatsApp integration for merchant communication
- Order confirmation by both user and merchant

### Support

- Contact form sends emails to support team
- Support tickets stored in Firebase
- Email integration via Resend (optional)

## Firebase Database Structure

```
/users/{userId}/
  /profile              # User profile data
  /role                 # User role (customer/merchant/admin)

/customers/{userId}/
  /name
  /email
  /addresses/{addressId}

/products/{productId}/
  /name
  /price
  /stock
  /categoryId
  /merchantId
  /imageUrl
  /rating
  /soldCount

/marketplaceOrders/{userId}/{orderId}/
  /items
  /total
  /status
  /whatsappMessage
  /merchantId
  /merchantName
  /merchantPhone

/supportTickets/{ticketId}/
  /name
  /email
  /subject
  /message
  /status
  /createdAt
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Format code

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

The application can be deployed to Vercel, Netlify, or any Node.js hosting platform.

1. Build the application:
```bash
pnpm build
```

2. Set environment variables in your hosting platform

3. Deploy following your platform's instructions

## Environment Variables

See `ENV_SETUP.md` for detailed environment variable configuration.

## License

Private project - All rights reserved

## Support

For support, email haritssetiono2304@gmail.com or use the support form in the application.
