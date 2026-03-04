# ArchitectWP — StudioDesignPalette

> A high-performance architecture portfolio platform built with React and Vite, powered by Firebase, enhanced with GSAP and Framer Motion, and production-ready for serverless deployment on Vercel.

---

## Overview

ArchitectWP is a modern architecture and design portfolio platform engineered for studios, architects, and creative agencies. It combines a performance-optimized frontend with a scalable serverless backend, offering production-grade infrastructure with clean architecture and strong security practices.

The system is designed to support dynamic content management, optimized media delivery, secure authentication, and seamless deployment workflows.

---

## Core Capabilities

* High-performance frontend built with React 18 and Vite
* Modern responsive UI using Tailwind CSS
* Advanced motion design powered by GSAP and Framer Motion
* Firebase integration (Firestore, Storage, Analytics)
* CDN-based image optimization via ImageKit
* Protected Admin Dashboard with full CRUD operations
* Local API mocking with authentication simulation
* JWT-based authentication with rate limiting
* Audit logging architecture
* Serverless deployment (Vercel-ready)

---

## System Architecture

### High-Level Flow

```
Client (Browser)
        │
        ▼
React + Tailwind UI
        │
        ▼
Authentication Layer (JWT)
        │
        ▼
Serverless API (/api)
        │
        ├── Firestore (Database)
        ├── Firebase Storage
        └── ImageKit CDN
```

---

## Technology Stack

### Frontend

* React 18
* Vite
* Tailwind CSS

### Animation

* GSAP
* Framer Motion

### Backend (Serverless)

* Vercel Serverless Functions
* JWT Authentication
* Custom Rate Limiting
* Audit Logging

### Database & Storage

* Firebase Firestore
* Firebase Storage

### Media Optimization

* ImageKit CDN

### Tooling

* ESLint
* npm

---

## Getting Started

### Prerequisites

* Node.js 18.x
* npm / yarn / pnpm
* (Optional) Vercel CLI

---

### 1. Clone Repository

```bash
git clone https://github.com/VANSH4NAGPAL/ArcitectWP.git
cd ArcitectWP
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root:

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

# Authentication
JWT_SECRET=
```

**Important:**
Never commit `.env` files or private keys to version control.

---

## Development

Start development server:

```bash
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## Local API Mocking (Development Only)

During development, `vite.config.js` intercepts:

* `/api/auth/*`
* `/api/headinfo/*`

Included features:

* Mock authentication
* JWT token simulation
* Rate limiting logic
* Audit logging
* Debug logging

### Example Request

```bash
curl -X POST http://localhost:5173/api/auth/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"only@admin","password":"your-password"}'
```

---

## Project Structure

```
.
├── api/                  # Vercel Serverless Functions
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── vercel.json
├── package.json
└── .env (ignored)
```

---

## Application Routes

### Public Routes

| Route        | Description     |
| ------------ | --------------- |
| /            | Landing page    |
| /about       | Studio overview |
| /projects    | Project gallery |
| /project/:id | Project details |
| /contact     | Contact page    |

### Admin Routes (Protected)

| Route                 | Description     |
| --------------------- | --------------- |
| /headinfo             | Admin dashboard |
| /headinfo/add         | Add project     |
| /headinfo/list        | Project list    |
| /headinfo/edit/:docId | Edit project    |

Admin routes are protected using `AdminAuthWrapper`.

---

## Firestore Data Model

**Collection:** `projects`

Example document:

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

## Image Upload Architecture

Uploads are handled via:

```
src/utils/uploadToImageKit.js
```

Parameters used:

* file
* upload_preset
* fileName
* publicKey

**Production Recommendation:**
Use server-side signed uploads through a secure `/api` endpoint.

---

## Security Checklist (Pre-Production)

* Move all configurations to environment variables
* Replace development JWT secrets
* Enable Firestore security rules
* Enable Firebase Storage rules
* Implement signed ImageKit uploads
* Validate all admin inputs
* Protect serverless routes
* Enable production rate limiting

---

## Production Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Deployment (Vercel)

### Option 1 — Dashboard

1. Connect GitHub repository
2. Configure environment variables
3. Deploy

### Option 2 — CLI

```bash
npm run deploy-prod
```

Serverless functions are automatically deployed from the `/api` directory.

---

## NPM Scripts

| Script                 | Purpose                  |
| ---------------------- | ------------------------ |
| npm run dev            | Start development server |
| npm run build          | Create production build  |
| npm run preview        | Preview production build |
| npm run lint           | Run ESLint               |
| npm run deploy-prod    | Deploy to Vercel         |
| npm run security-audit | Run security audit       |

---

## Recommended Enhancements

* Add `.env.example`
* Add unit and integration tests
* Add `/api` documentation
* Add LICENSE (MIT recommended)
* Add CI/CD workflow (GitHub Actions)
* Add screenshots and live demo link

---

## Contributing

Pull requests are welcome.

For security-related changes:

* Do not commit secrets
* Document changes clearly
* Keep pull requests focused and reviewable

---

## License

No license currently included.

Recommended:
MIT License

---

## Project Highlights

* Full-stack serverless architecture
* JWT authentication with rate limiting
* Media optimization via CDN integration
* Secure admin dashboard with complete CRUD functionality
* Production-ready deployment pipeline

---

ArchitectWP is structured as a scalable, secure, and performance-driven portfolio system ready for professional studio deployment and long-term extensibility.
