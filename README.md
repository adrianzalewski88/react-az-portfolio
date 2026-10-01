# React - AZ Portfolio

A modern, animated portfolio application built with **React, TypeScript, Vite, SCSS, Motion, and Laravel Passport OAuth2**.

This project serves as the frontend portfolio experience for **Adrian Zalewski**, a Senior Full Stack PHP Developer. Portfolio project content is managed by a separate Laravel application and consumed through a REST API.

The application demonstrates a modern frontend architecture while also showcasing integration with a PHP/Laravel backend, OAuth2 authentication, API consumption, CI/CD, and production deployment.

---

## 🚀 Live Applications

### React Portfolio

**Production:**
https://portfolio.adrian-zalewski.com/

### Laravel Portfolio Source

The React application consumes portfolio data from the Laravel application:

**Production:**
https://portfolio-source.adrian-zalewski.com/

### GitHub

**React repository:**
https://github.com/adrianzalewski88/react-az-portfolio

**Laravel repository:**
https://github.com/adrianzalewski88/laravel-az-portfolio

---

## ✨ Features

### Portfolio Experience

* Animated portfolio homepage
* Project catalog and project detail pages
* Project category filtering
* Project search
* Multiple sorting options
* Grid and list views
* Related projects
* Project statistics
* Featured project imagery
* Responsive design
* Animated transitions between filtered results
* Interactive hover effects
* Animated backgrounds and visual effects
* Responsive navigation
* Developer authentication experience

### API Integration

Portfolio project data is retrieved from the Laravel backend through REST API endpoints.

The frontend is designed to consume:

```text
Laravel API
    ↓
React Query
    ↓
React Components
    ↓
Portfolio UI
```

The application uses **TanStack Query** for API data fetching and caching.

### OAuth2 Authentication

The project demonstrates browser-based OAuth2 authentication using:

* Laravel Passport
* Authorization Code flow
* PKCE
* Public OAuth client
* Protected API endpoints
* OAuth callback handling
* Access tokens

The React application does **not** contain an OAuth client secret.

Because React is a browser application, values exposed through `VITE_*` environment variables are considered public.

---

# 🧱 Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Motion
* Lucide React
* SCSS
* HTML5
* CSS3

## Backend

The React application consumes a separate Laravel application providing:

* Laravel REST API
* Laravel Passport
* OAuth2 authentication
* Project management
* Category management
* Authentication
* Database persistence

Backend repository:

https://github.com/adrianzalewski88/laravel-az-portfolio

## Infrastructure

* GitHub
* GitHub Actions
* Linux
* Apache
* PHP
* Laravel
* MySQL
* Linode
* SSH
* rsync
* Composer
* npm

---

# 🏗️ Application Architecture

The project is intentionally split into a frontend application and backend/source application.

```text
┌───────────────────────────────────────────────┐
│                  React SPA                    │
│                                               │
│  portfolio.adrian-zalewski.com               │
│                                               │
│  React + TypeScript + Vite + SCSS + Motion   │
└──────────────────────┬────────────────────────┘
                       │
                       │ REST API
                       │
                       ▼
┌───────────────────────────────────────────────┐
│              Laravel Application              │
│                                               │
│  portfolio-source.adrian-zalewski.com        │
│                                               │
│  Laravel + MySQL + Passport + REST API       │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
                 ┌───────────┐
                 │  MySQL    │
                 │ Database  │
                 └───────────┘
```

The separation allows the React application to function as an independent frontend while Laravel acts as the portfolio content source.

---

# 🔌 API Architecture

The Laravel application exposes two API areas.

## Public API

Public portfolio content can be accessed without OAuth authentication.

```text
/api/v1/public/projects
/api/v1/public/projects/{slug}

/api/v1/public/categories
/api/v1/public/categories/{slug}
```

These endpoints are used for normal portfolio browsing.

## Protected API

The Laravel application also exposes protected equivalents:

```text
/api/v1/projects
/api/v1/projects/{slug}

/api/v1/categories
/api/v1/categories/{slug}
```

These endpoints require Laravel Passport authentication and the appropriate OAuth scope.

Current scope:

```text
portfolio:read
```

The protected API exists intentionally as part of the portfolio's technical demonstration.

The portfolio data itself is not considered sensitive.

---

# 🔐 OAuth2 + PKCE

The application demonstrates a browser-based OAuth2 integration between React and Laravel.

```text
React
  │
  │ 1. Authorization request
  ▼
Laravel Passport
  │
  │ 2. User authorization
  ▼
OAuth callback
  │
  │ 3. Authorization code
  ▼
React
  │
  │ 4. PKCE token exchange
  ▼
Laravel Passport
  │
  │ 5. Access token
  ▼
Protected Laravel API
```

The React application uses a **public OAuth client**.

No client secret is embedded in the React application.

This is important because browser-delivered JavaScript cannot securely hide a client secret.

---

# ⚙️ Environment Variables

## Local Development

Create:

```text
.env.local
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1

VITE_OAUTH_AUTHORIZE_URL=http://localhost:8000/oauth/authorize

VITE_OAUTH_TOKEN_URL=http://localhost:8000/oauth/token

VITE_OAUTH_CLIENT_ID=YOUR_LOCAL_PASSPORT_CLIENT_ID

VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

`.env.local` should not be committed to Git.

---

# 🌎 Production Environment

Production values are supplied through GitHub repository variables.

Example:

```env
VITE_API_BASE_URL=https://portfolio-source.adrian-zalewski.com/api/v1

VITE_OAUTH_AUTHORIZE_URL=https://portfolio-source.adrian-zalewski.com/oauth/authorize

VITE_OAUTH_TOKEN_URL=https://portfolio-source.adrian-zalewski.com/oauth/token

VITE_OAUTH_CLIENT_ID=YOUR_PRODUCTION_PASSPORT_CLIENT_ID

VITE_OAUTH_REDIRECT_URI=https://portfolio.adrian-zalewski.com/auth/callback
```

GitHub Actions creates the production environment configuration before building the application.

The production `.env.production` file does not need to be placed on the web server.

Vite embeds the `VITE_*` values into the production JavaScript bundle during the build process.

---

# 🛠️ Local Development

## Requirements

Recommended development environment:

* Node.js 22+
* npm
* Git
* Docker
* Laravel backend

The Laravel application should be running locally before testing API functionality.

---

## Install Dependencies

Clone the repository:

```bash
git clone https://github.com/adrianzalewski88/react-az-portfolio.git
```

Enter the project:

```bash
cd react-az-portfolio
```

Install dependencies:

```bash
npm install
```

---

## Configure Environment

Create:

```text
.env.local
```

and configure the local Laravel API and OAuth endpoints.

---

## Start Development Server

```bash
npm run dev
```

The development application runs at:

```text
http://localhost:5173/
```

---

# 🧪 Type Checking

TypeScript type checking is available through:

```bash
npm run typecheck
```

This runs:

```bash
tsc --noEmit
```

The project uses TypeScript primarily to improve development safety while maintaining a React/Vite architecture.

---

# 📦 Production Build

Create a production build with:

```bash
npm run build
```

Vite outputs the compiled application to:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# 🚀 Deployment

Production deployment is handled through **GitHub Actions**.

The deployment process is designed so that Node.js is **not required on the production web server**.

The GitHub Actions runner performs the frontend build.

```text
GitHub
   │
   │ push to main
   ▼
GitHub Actions
   │
   ├── Checkout
   ├── Install dependencies
   ├── Configure production environment
   ├── Type check
   ├── Build React application
   │
   ▼
   dist/
   │
   │ rsync / SSH
   ▼
Linode
   │
   ▼
Apache
   │
   ▼
portfolio.adrian-zalewski.com
```

This keeps the production server lightweight and avoids requiring Node.js on the web server.

---

# 🔄 CI/CD

The project uses GitHub Actions for continuous deployment.

The workflow performs the following general process:

1. Checkout repository
2. Install Node.js
3. Install npm dependencies
4. Create production environment configuration
5. Run TypeScript type checking
6. Build the React application
7. Configure SSH
8. Transfer compiled assets to the production server
9. Deploy the updated application

Production configuration is supplied through GitHub repository variables rather than committing environment-specific values to the repository.

---

# 📁 Project Structure

The application follows a component/page-oriented React structure.

```text
src/
├── components/
│   ├── ...
│
├── pages/
│   ├── HomePage
│   ├── ProjectPage
│   ├── AuthCallback
│   └── ...
│
├── services/
│   ├── API
│   ├── OAuth
│   └── ...
│
├── hooks/
│   └── ...
│
├── types/
│   └── ...
│
├── styles/
│   ├── main.scss
│   └── ...
│
├── App
└── main
```

The exact implementation structure may evolve as the application grows.

---

# 🎨 Design System

The application uses a light modern visual system built around:

```scss
$primary: #1f69ff;
$secondary: #711fff;
$surface: #ffffff;
```

The design emphasizes:

* High contrast
* Layered surfaces
* Gradient effects
* Glowing accents
* Blur effects
* Animated backgrounds
* Smooth transitions
* Micro-interactions
* Motion-driven page transitions
* Responsive layouts

The goal is to demonstrate that a technically focused developer portfolio does not have to look like a static résumé.

---

# 🎞️ Animation

Motion is used extensively throughout the application.

Examples include:

* Page transitions
* Project card entrance animations
* Hover transformations
* Category filtering transitions
* Animated statistics
* Background movement
* Button interactions
* Image effects
* Navigation transitions
* Layout changes

The project uses the Motion library rather than relying exclusively on CSS animations.

---

# 🖼️ Portfolio Assets

The application includes portfolio-specific visual assets such as:

```text
public/images/
├── portfolio-banner-background.jpg
├── portfolio-owner-picture.jpg
└── project-placeholder.jpg
```

These assets are used throughout the homepage and project presentation experience.

---

# 👨‍💻 About the Developer

**Adrian Zalewski**

Senior Full Stack PHP Developer with extensive experience building web applications, APIs, content management systems, integrations, and custom web platforms.

The AZ Portfolio ecosystem is designed to demonstrate practical experience across the modern PHP and JavaScript development stack.

### Primary Technologies

* PHP
* Laravel
* Symfony
* Drupal
* WordPress
* React
* TypeScript
* JavaScript
* MySQL
* REST APIs
* OAuth2
* Git
* GitHub Actions
* CI/CD
* Apache
* Linux

---

# 🔗 Contact

### Website

https://adrian-zalewski.com/

### GitHub

https://github.com/adrianzalewski88

### LinkedIn

https://www.linkedin.com/in/adrian-zalewski-1988-fa/

### Email

[fictionarts@gmail.com](mailto:fictionarts@gmail.com)

### Location

Cumberland, Rhode Island, USA

---

# 📚 Related Projects

The AZ Portfolio ecosystem is intentionally built as multiple applications demonstrating different parts of a modern full-stack architecture.

## React AZ Portfolio

Frontend portfolio and API consumer.

https://github.com/adrianzalewski88/react-az-portfolio

## Laravel AZ Portfolio

Portfolio source/CMS and REST API.

https://github.com/adrianzalewski88/laravel-az-portfolio

## Symfony AZ Portfolio

Separate Symfony portfolio application demonstrating PHP framework experience.

https://github.com/adrianzalewski88/symfony-az-portfolio

---

# 🎯 Project Goals

This project is more than a personal portfolio website.

It is also a practical demonstration of:

* React application architecture
* TypeScript
* REST API integration
* API state management
* OAuth2
* PKCE
* Laravel Passport
* PHP/Laravel backend integration
* CI/CD
* GitHub Actions
* Linux deployment
* Apache hosting
* Environment-specific configuration
* Secure credential handling
* Responsive UI engineering
* Animation and interaction design
* Separation of frontend and backend responsibilities

The project is intentionally structured to provide a realistic example of how a modern React frontend can communicate with a PHP/Laravel backend in a production environment.

---

# 📄 License

This project is a personal portfolio application created by Adrian Zalewski.
