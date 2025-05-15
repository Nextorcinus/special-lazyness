# Special Lazyness 

A Next.js application that helps Whiteout Survival players plan and track progress across multiple in-game systems:

- **Chief Gear** upgrade calculator  
- **Research** time & resource planner  
- **Buildings Upgrade** estimator (Basic & Fire Crystal tiers)  
- **War Academy** progression tracker  
- **History & Comparison**: save past calculations and compare results  
- **Responsive UI** built with Shadcn/UI, Tailwind CSS, and Radix components  

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
4. [Project Structure](#project-structure)  
5. [Environment Variables](#environment-variables)  
6. [Contributing](#contributing)  
7. [License](#license)  

---

## Features

- **Smart Calculations**  
  Calculate resources & build/research times, factoring in buffs (Pet, VIP, Zinman Skill, Double Time, VP/President bonuses).
- **Drag-scroll Subcategories**  
  Smooth horizontal scroll with no visible scrollbar for selecting Crystal tiers, Helios subcategories, etc.
- **History & Compare**  
  Save each run, reset or delete entries, and see global surplus/shortage in a color-coded grid.
- **War Academy Module**  
  Plan your War Academy level-ups, track XP requirements, and visualize progress.
- **Modern UI**  
  Built with [Next.js](https://nextjs.org/) App Router, [Shadcn/UI](https://ui.shadcn.com/), [Radix](https://www.radix-ui.com/), and Tailwind CSS.

---

## Tech Stack

- **Framework**: Next.js 13 (App Router)  
- **Language**: JavaScript (ES2023)  
- **UI**: Shadcn/UI & Radix primitives, Tailwind CSS  
- **Data**: Local JSON under `/data/`  
- **Bundler**: Vercel (production), `vercel.json` config  
- **Linting**: ESLint (via `eslint.config.mjs`)  
- **PostCSS** & **Autoprefixer** (via `postcss.config.js`)  

---

##  Konfigurasi
Tailwind CSS: tailwind.config.js & postcss.config.js

Next.js: next.config.js (setting experimental, rewrites, dsb.)

Vercel: vercel.json (environment, redirects)

Sesuaikan environment variables di .env.local sesuai kebutuhan (misal API keys, base URL, dsb.).

### Prerequisites

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x  


