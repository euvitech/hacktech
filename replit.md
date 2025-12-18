# Vitrine Digital SCS

## Overview
Interactive demo of a local marketplace platform for the SCS neighborhood. This is a pitch demo showcasing a digital ecosystem that connects local stores with consumers, featuring product catalogs, store maps, pickup/delivery options, and a loyalty program.

## Current State
Fully functional React demo with all core features implemented:
- Home page with hero, search, categories, and promotions
- Product catalog with filters and search
- Product detail pages with pickup/delivery options
- Interactive store map
- Shopping cart with QR code generation
- Loyalty program dashboard

## Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **State**: React Context + LocalStorage

## Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProductCard.jsx
├── pages/          # Route pages
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── ProductDetail.jsx
│   ├── Map.jsx
│   ├── Cart.jsx
│   └── Loyalty.jsx
├── context/        # React Context providers
│   └── CartContext.jsx
├── data/           # Mock data
│   └── mockData.js
├── App.jsx         # Main app with routing
├── main.jsx        # Entry point
└── index.css       # Tailwind + custom styles
```

## Design System
### Colors
- Primary: #FF6B35 (Orange - commerce energy)
- Secondary: #004E89 (Blue - trust/technology)
- Success: #1A936F (Green - growth)
- Accent: #FFC857 (Yellow - highlights/happy hour)
- Dark: #114B5F (Dark blue - text)
- Light: #F7F7FF (Off-white - backgrounds)

### Typography
- Font: Arial (system font, web-safe)

## Key Features
1. **Unified Catalog** - Search across all local stores
2. **Omnichannel** - "Retire no SCS" (pickup) or Delivery options
3. **Interactive Map** - Visual store locator with filters
4. **Loyalty Program** - Points, cashback, tiers (Bronze/Prata/Ouro)
5. **Happy Hour** - Double points during 17:00-19:00
6. **QR Code Pickup** - Generated for store pickups

## Running the Project
```bash
npm install
npm run dev
```
Server runs on port 5000.

## Recent Changes
- December 17, 2025: Initial demo implementation completed
  - All 6 main pages implemented
  - 20 products, 8 stores in mock data
  - Full cart/checkout flow with QR code
  - Loyalty program with 3 tiers
