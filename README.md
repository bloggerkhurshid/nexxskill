# 🚀 NexxSkill - Public Web Portal

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

NexxSkill is an enterprise-grade online engineering academy portal designed for technical training, live webinars, day-wise course streaming, Razorpay payment processing, and verifiable invoice generation.

---

## ✨ Features

- **🎓 Enterprise Course Catalog**: Browse available cohorts, crash courses, and technical programs.
- **🎥 Day-Wise Video Player**: Multi-day video playlist streaming with custom fullscreen toggles and right-click download protection.
- **💳 Seamless Razorpay Integration**: Direct checkout support for UPI, Credit/Debit cards, Net Banking, and instant coupon verification.
- **🧾 Mobile-Responsive Tax Invoices**: Download official tax receipts as high-resolution PNGs or print directly.
- **📅 Interactive Live Webinars**: Seat reservation system with real-time seat quota countdown.
- **🔐 JWT Authentication**: Student registration, login, profile management, and enrolled course library.
- **🌐 Netlify SPA Optimized**: Built-in `_redirects` and `netlify.toml` for zero-404 route refreshes.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, Vite
- **Styling**: TailwindCSS, Lucide Icons, Google Fonts (Outfit / Space Grotesk)
- **State Management**: React Context API (`AuthContext`, `AuthModalContext`, `WebinarModalContext`)
- **HTTP Client**: Axios with baseURL interceptors
- **Invoice Export**: `html-to-image`

---

## 📂 Project Structure

```text
public-web/
├── public/
│   ├── _redirects         # Netlify SPA route handling
│   ├── assets/            # Static media and logos
│   └── favicon.png
├── src/
│   ├── components/        # Navigation, Footer, Modals, Header
│   ├── context/           # Global Authentication & Modal Contexts
│   ├── hooks/             # Custom hooks (e.g. useRazorpay)
│   ├── pages/             # Home, Courses, Webinars, Dashboard, About, Contact
│   ├── services/          # Axios API configuration
│   ├── App.jsx            # Routing and App entry
│   └── index.css          # Tailwind CSS directives & custom utility rules
├── .env.example           # Environment variable template
├── netlify.toml           # Netlify build configuration
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://nexxskill.kodeburner.com
VITE_RAZORPAY_KEY_ID=rzp_test_TPuzQT6xD1Otnp
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
