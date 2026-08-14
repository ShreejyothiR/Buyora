# Buyora - AI Product Intelligence & Comparison Platform

> **"Don't Just Compare Products. Understand Them."**  
> AI-powered product intelligence that reveals what sellers omit: hidden costs, marketing hype vs technical evidence, missing specifications, post-purchase regret risks, and true long-term value.

---

## 🌟 Overview & Capabilities

Buyora is a full-stack, production-grade product intelligence platform engineered to protect consumers and students from deceptive marketing, unbundled hidden accessories, artificial discounts, and mismatched hardware.

### Key Intelligence Features:
1. **Multi-Product Comparison Matrix**: Side-by-side comparison of 2 to 4 products with dynamic personalized weight scoring (Price, Performance, Battery, Durability, Camera, Portability, Long-term value).
2. **What the Seller Didn't Tell You**: Automatically discovers omitted specifications (soldered RAM, sustained brightness vs 1% peak, SSD NAND type, out-of-warranty repair costs) and generates a **Listing Completeness Score**.
3. **Marketing Language Translator**: Detects marketing hype ("Military Grade", "Studio Audio", "All-Day Battery") and translates them into verified technical facts with confidence percentages.
4. **Hidden Cost & Real TCO Detector**: Calculates unbundled mandatory power bricks, cables, protective shields, and subscriptions to reveal the **Total Cost of Ownership**.
5. **Fake / Suspicious Discount Radar**: Evaluates baseline market prices against historical launch MSRPs to spot inflated promotional discounts.
6. **Review Intelligence & Bot Anomaly Filter**: Aggregates verified user complaints across thermal/heating, battery drain, and build quality while scoring bot review anomaly likelihood.
7. **8-Axis Product DNA Radar**: Visualizes Performance, Real Value, Durability, Portability, Innovation, Repairability, Risk, and Longevity on interactive Recharts radar diagrams.
8. **Future-Proof Score & Regret Predictor**: Analyzes multi-year software support, upgradeability, and hardware endurance to predict specific buyer regrets before checkout.
9. **"Who Should NOT Buy This?"**: Flags users whose workflows or requirements will clash with the device's limitations.
10. **Upgrade vs Buy New Calculator**: Compares an existing device to target products to calculate generational throughput jumps and battery recovery gains.
11. **Context-Aware AI Assistant & Voice Interface**: Natural voice interaction (Web Speech STT + TTS) that understands the products currently under comparison.
12. **Price Intelligence & Alerts**: Interactive historical price graph with AI deal timing advice ("Good Time to Buy" vs "Wait for Sale") and persistent target price watches.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (light, clean, modern UI), React Router v6, Axios, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js REST API, Prisma ORM, JWT Authentication, bcryptjs, Multer file upload handling, Morgan.
- **Database**: PostgreSQL / SQLite (zero-config out-of-the-box support with Prisma).
- **AI Intelligence**: Google Gemini API (`@google/generative-ai` with structured JSON schema outputs) with automated heuristic fallback engine.
- **Voice Intelligence**: Browser Speech Recognition API (STT) + Speech Synthesis API (TTS).

---

## 📂 Project Structure

```
buyora/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma models (User, Product, Analysis, Reviews, Alerts, Chat, etc.)
│   │   └── seed.js             # Comprehensive dataset with 7 flagship devices & price histories
│   ├── src/
│   │   ├── ai/
│   │   │   └── geminiService.js # Google Gemini & Fallback Intelligence Engine
│   │   ├── controllers/        # Auth, Product, Compare, AI, Price, Review, Upload, Saved
│   │   ├── middleware/         # JWT Auth, Multer file upload validation
│   │   ├── routes/             # Express API route endpoints
│   │   ├── services/           # Product scoring, dynamic weight matrix, upgrade calculator
│   │   ├── prisma.js           # Prisma client singleton
│   │   └── server.js           # Central Express app entrypoint
│   ├── uploads/                # Uploaded screenshots, images & spec PDFs
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, VerdictBadge, ProductDnaRadar, PriceChart, Modals
│   │   ├── context/            # AuthContext (JWT, user state, preference weights)
│   │   ├── pages/              # Home, Login, Register, Dashboard, Compare, Detail, Assistant, etc.
│   │   ├── services/           # Axios REST API client
│   │   ├── App.jsx             # React Router structure & global modals
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Quick Setup Guide

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` or `v24+`
- **npm**: `v9+` or `v11+`

### 2. Backend Setup
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment
# Copy .env.example to .env
# (Optional) Add your GEMINI_API_KEY if available
cp .env.example .env

# 3. Synchronize database and generate Prisma Client
npx prisma db push

# 4. Seed database with real-world products & reviews
npm run seed

# 5. Start backend server (Runs on port 5000)
npm run dev
# or
node src/server.js
```

### 3. Frontend Setup
```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server (Runs on port 3000)
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🔑 Demo Account Credentials

For instant access with preloaded saved products and active price alerts:
- **Email**: `demo@buyora.com`
- **Password**: `password123`
- *(Or click the **1-Click Demo Login** button on the Login page)*

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `GET` | `/api/auth/me` | Get current authenticated user profile |
| `PUT` | `/api/auth/preferences` | Update custom category scoring weights |
| `GET` | `/api/products` | List & filter products with search/category/verdict |
| `GET` | `/api/products/:id` | Get deep product intelligence record |
| `POST` | `/api/products` | Create / ingest verified product |
| `POST` | `/api/products/upgrade-compare` | Calculate "Upgrade vs Buy New" delta |
| `POST` | `/api/compare` | Run multi-product comparison with dynamic weights |
| `POST` | `/api/ai/extract` | Multimodal AI OCR extraction from URL/text/file |
| `POST` | `/api/ai/chat` | Context-aware conversational AI assistant |
| `POST` | `/api/ai/recommend` | Budget optimizer recommendation |
| `GET` | `/api/prices/:productId` | Price history & deal timing advice |
| `POST` | `/api/prices/alerts` | Create automated price drop alert |
| `GET` | `/api/prices/alerts/user` | Get active user price alerts |
| `GET` | `/api/reviews/:productId` | Get reviews with AI sentiment & anomaly analysis |
| `POST` | `/api/upload` | Upload screenshot/PDF/image for OCR |
| `GET` | `/api/saved` | Get user's saved products |
| `POST` | `/api/saved/toggle` | Save/unsave product |

---

## 📄 License & Attribution
Buyora is built for consumer transparency and independent product verification.
All product names, trademarks, and registered trademarks are property of their respective owners.
