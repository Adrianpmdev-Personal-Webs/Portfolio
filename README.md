<div align="center">

# 🖥️ Portfolio XP

### A personal portfolio that brings the Windows XP experience to the web

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_the_portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://adrianpmdev-portfolio.vercel.app/)
[![Author](https://img.shields.io/badge/Author-adrianpmdev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/adrianpmdev)

</div>

---

<br>

## 🌐 Live Demo

👉 **[adrianpmdev-portfolio.vercel.app](https://adrianpmdev-portfolio.vercel.app/)**

---

<br>

## 📖 Description

Personal portfolio built with **Angular** that recreates the visual experience of **Windows XP** in a web format.

The project combines a retro interface (**boot screen, login, desktop, windows and Start menu**) with an interactive presentation of projects and skills.

> 🕹️ **Boot → Login → Desktop**: the full XP experience, adapted to a modern context.

---

<br>

## 🎯 Purpose

- 🌟 Showcase personal projects through a more original and memorable experience than a traditional portfolio.
- 🧩 Demonstrate frontend development skills with a modular architecture, strong typing and separation of responsibilities.
- 🌍 Apply internationalization and animations to improve the user experience.
- 🎨 Keep a consistent Windows XP-inspired aesthetic, adapted to a modern context.

---

<br>

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white) | Core framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Typed language |
| ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white) | Styling |
| ![Angular Material](https://img.shields.io/badge/Angular_Material-009688?style=flat-square&logo=angular&logoColor=white) | UI components |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black) | Animations |
| ![ngx-translate](https://img.shields.io/badge/ngx--translate-4285F4?style=flat-square&logo=googletranslate&logoColor=white) | Internationalization (🇪🇸 ES / 🇬🇧 EN / 🇫🇷 FR) |
| ![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=flat-square&logo=reactivex&logoColor=white) | Reactive programming |

---

<br>

## 🏗️ Project Approach

- 🧱 Architecture based on **standalone components**, following the official [Angular style guide](https://angular.dev/style-guide) (feature folders, no type suffixes).
- 📂 Code organized in `core`, `shared` and `features`:

```
src/app/
├── app.ts · app.config.ts · app.routes.ts
│
├── core/                             # App-wide singletons, no UI
│   ├── analytics/                    # Event logging
│   ├── i18n/                         # Language settings
│   └── session/                      # User session
│
├── shared/                           # Pieces used by several features
│   └── project-status/               # Project status model + label pipe
│
└── features/
    ├── boot/                         # Boot screen route
    ├── login/                        # Login route
    │
    ├── desktop/                      # Desktop route
    │   ├── desktop.ts
    │   ├── desktop-guard.ts          # Protects the desktop route
    │   ├── window-manager.ts         # Window state (open, minimized, focus, z-order)
    │   ├── desktop-window.ts
    │   ├── desktop-icon/
    │   ├── taskbar/                  # Start menu, window tabs, language, clock
    │   └── xp-window/                # XP window frame that lazy-loads each app
    │
    └── apps/                         # Desktop applications
        ├── app-definition.ts         # Contract every app implements
        ├── app-registry.ts           # List of installed apps
        ├── my-pc/
        │   ├── my-pc-manifest.ts
        │   └── skills-data.ts
        ├── internet-explorer/
        │   ├── internet-explorer-manifest.ts
        │   └── web-projects-data.ts       # Web projects
        ├── photo-viewer/
        │   ├── photo-viewer-manifest.ts
        │   └── mobile-projects-data.ts    # Mobile projects
        └── minesweeper/
            ├── minesweeper-manifest.ts
            └── minesweeper-engine.ts      # Game logic, UI-independent
```

- 🧩 **Pluggable apps**: each app lives in its own folder with a manifest (`<app>-manifest.ts`). Adding one means creating its folder and listing its manifest in `features/apps/app-registry.ts`; the desktop, Start menu and taskbar pick it up automatically and its code is lazy-loaded.
- 🗂️ **Data-driven projects**: web and mobile projects live in `features/apps/internet-explorer/web-projects-data.ts` and `features/apps/photo-viewer/mobile-projects-data.ts`, so adding a project doesn't require touching any component.

- 🔐 Client-side user session management to control the boot / login / desktop flow.
- 🎭 Interface focused on the visual experience and the narrative of the portfolio.
- 📱 **Responsive design**: on mobile, windows are displayed fullscreen and stacked, like native app screens.

---

<br>

## 📄 License

Source code licensed under the **MIT License**. Personal content and Windows XP assets are excluded. See [LICENSE](LICENSE) for details.

---

<br>

## 👤 Author

[@adrianpmdev](https://github.com/adrianpmdev) · Junior Full Stack Developer

---

<br>

<div align="center">

✨ Made in **2026** by [@adrianpmdev](https://github.com/adrianpmdev) ✨

</div>
