# 🏗️ ArchitectWP — StudioDesignPalette

<img src="/logofull.png" alt="StudioDesignPalette Logo" width="100%" />

> A high-performance architecture portfolio platform built with **React + Vite**, powered by **Firebase**, animated with **GSAP & Framer Motion**, and production-ready for **Vercel deployment**.

---

## ✨ Overview

ArchitectWP is a modern architecture/design portfolio platform featuring:

- ⚡ Blazing-fast Vite + React frontend
- 🎨 Tailwind CSS modern UI
- 🎬 GSAP & Framer Motion animations
- 🔥 Firebase (Firestore + Storage + Analytics)
- 🖼️ ImageKit image optimization & uploads
- 🛡️ Protected Admin Dashboard (CRUD Projects)
- 🧪 Local API mocks (Auth + Rate Limiting + Audit Logs)
- ☁️ Serverless API (Vercel ready)

Designed for architects, studios, and creative agencies.

---

# 🧰 Tech Stack

| Frontend | Backend | Media | Dev Tools |
|----------|----------|--------|-----------|
| React 18 | Vercel Serverless | ImageKit | Vite |
| Tailwind CSS | JWT Auth | Firebase Storage | ESLint |
| GSAP | Rate Limiting | Firestore | Custom Vite Mock API |
| Framer Motion | Audit Logging | Analytics | npm |

---

# 🚀 Getting Started

## 1️⃣ Prerequisites

- Node.js **18.x**
- npm / yarn / pnpm
- (Optional) Vercel CLI

---

## 2️⃣ Clone & Install

```bash
git clone https://github.com/VANSH4NAGPAL/ArcitectWP.git
cd ArcitectWP
npm install
```

---

## 3️⃣ Environment Setup

Create a `.env` file in root:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# ImageKit
VITE_IMAGEKIT_URL_ENDPOINT=
VITE_IMAGEKIT_UPLOAD_PRESET=
VITE_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_API=

# Auth
JWT_SECRET=
```

⚠️ Never commit `.env` or private keys.

---

# 💻 Development

Start dev server:

```bash
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

## 🧪 Local API Mocking (Dev Only)

During development, `vite.config.js` intercepts:

- `/api/auth/*`
- `/api/headinfo/*`

Features:
- Mock login
- JWT token simulation
- Rate limiting
- Audit logging
- Console debugging

Example:

```bash
curl -X POST http://localhost:5173/api/auth/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"only@admin","password":"your-password"}'
```

---

# 📁 Project Structure

```
.
├── api/                  # Serverless functions (Vercel)
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── vercel.json
└── package.json
```

---

# 🌐 Routes

## Public

| Route | Description |
|-------|-------------|
| `/` | Landing Page |
| `/about` | About Studio |
| `/projects` | Horizontal project gallery |
| `/project/:id` | Project detail page |
| `/contact` | Contact page |

## Admin (Protected)

| Route | Description |
|-------|-------------|
| `/headinfo` | Dashboard |
| `/headinfo/add` | Add Project |
| `/headinfo/list` | Project List |
| `/headinfo/edit/:docId` | Edit Project |

Protected using `AdminAuthWrapper`.

---

# 🗂️ Data Model (Firestore)

Collection: `projects`

Example:

```json
{
  "title": "Minimal House",
  "category": "Residential",
  "type": "Interiors",
  "year": "2025",
  "location": "Mumbai, IN",
  "description": "A compact minimal home...",
  "cimg": "https://ik.imagekit.io/...",
  "interiorImages": [],
  "exteriorImages": [],
  "projectDates": {
    "design": "Jan 2023",
    "fabrication": "Jun 2023",
    "opening": "Dec 2023"
  }
}
```

---

# 🖼️ Image Upload Flow (ImageKit)

Uploads handled via:

```
src/utils/uploadToImageKit.js
```

Uses:

- `file`
- `upload_preset`
- `fileName`
- `publicKey`

🔒 Production Recommendation:
Use server-side signed uploads via `/api` endpoint.

---

# 🛡️ Security

Before production:

- Move Firebase config to env variables
- Replace dev JWT secrets
- Enable Firestore rules
- Enable Storage rules
- Use signed ImageKit uploads
- Validate all admin inputs
- Protect serverless routes

---

# 🏗️ Production Build

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# ☁️ Deploy to Vercel

### Option 1 — Dashboard

1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Option 2 — CLI

```bash
npm run deploy-prod
```

(Serverless functions auto-deploy from `/api` folder)

---

# 📜 NPM Scripts

| Script | Purpose |
|--------|----------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | Lint project |
| `npm run deploy-prod` | Deploy to Vercel |
| `npm run security-audit` | Run audit checks |

---

# 🧾 Recommended Improvements

- Add `.env.example`
- Add unit tests
- Add API README in `/api`
- Add LICENSE (MIT recommended)
- Add GitHub badges
- Add screenshots section

---

# 🤝 Contributing

Pull requests welcome.

For security-related changes:
- Do NOT commit secrets
- Document changes clearly
- Keep PRs small and reviewable

---

# 📄 License

No license currently included.

Recommended:

```
MIT License
```

---

# 💎 Project Highlights

- Full-stack integration
- Serverless architecture
- Authentication + rate limiting
- Media optimization
- Admin dashboard CRUD
- Production-ready deployment

---

Made with ⚡ by Vansh Nagpal
