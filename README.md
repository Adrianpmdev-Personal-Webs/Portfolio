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

## 📸 Screenshots

<p align="center">
  <img src="docs/screenshots/desktop-internet-explorer.webp" alt="XP desktop with the Internet Explorer app showing a web project" width="100%">
</p>

<table>
  <tr>
    <td width="40%"><img src="docs/screenshots/photo-viewer.webp" alt="Photo Viewer app showing screenshots of a mobile project"></td>
    <td width="40%"><img src="docs/screenshots/start-menu.webp" alt="Start menu open over the My Data app"></td>
    <td width="20%"><img src="docs/screenshots/mobile.webp" alt="Mobile layout with an app in fullscreen"></td>
  </tr>
  <tr>
    <td align="center">Mobile projects in the Photo Viewer</td>
    <td align="center">Start menu and profile</td>
    <td align="center">Mobile layout</td>
  </tr>
</table>

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

| Technology                                                                                                                  | Purpose                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| ![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat-square&logo=angular&logoColor=white)                   | Core framework: standalone components, signals, zoneless              |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)             | Typed language                                                        |
| ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)                               | Styling                                                               |
| ![Angular Material](https://img.shields.io/badge/Angular_Material-009688?style=flat-square&logo=angular&logoColor=white)    | UI components (menus, progress bars, ripples)                         |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black)                          | Animations                                                            |
| ![ngx-translate](https://img.shields.io/badge/ngx--translate-4285F4?style=flat-square&logo=googletranslate&logoColor=white) | Internationalization (🇪🇸 ES / 🇬🇧 EN / 🇫🇷 FR)                          |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)                         | Hosting and serverless function that forwards visit events to Discord |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)                         | Linting with angular-eslint rules                                     |
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black)                   | Code formatting                                                       |

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
│   ├── device/                       # Device category and platform detection
│   ├── fullscreen/                   # Browser fullscreen
│   ├── i18n/                         # Supported languages and language settings
│   └── session/                      # User session
│
├── shared/                           # Pieces used by several features
│   ├── profile/                      # Author contact details (single source)
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
    │   ├── start-menu/               # XP Start menu
    │   ├── taskbar/                  # Start button, window tabs, language, clock
    │   └── xp-window/                # XP window frame that lazy-loads each app
    │
    └── apps/                         # Desktop applications
        ├── app-definition.ts         # Contract every app implements
        ├── app-registry.ts           # List of installed apps
        ├── app-window.ts             # Window context provided to each app
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
- ⚡ **Zoneless, signals and OnPush**: the app runs without `zone.js`; component state lives in signals and every component uses `OnPush` change detection.

---

<br>

## 🧑‍💻 Development

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm start`            | Dev server at `http://localhost:4200`   |
| `npm run build`        | Production build in `dist/`             |
| `npm run lint`         | ESLint with angular-eslint rules        |
| `npm run format`       | Format the project with Prettier        |
| `npm run format:check` | Check formatting without changing files |
| `npm run images`       | Convert new or replaced images to WebP  |

### 🖼️ Adding or replacing images

1. Drop the image (PNG, JPG, GIF, TIFF or AVIF) into its folder under `public/assets/images/`. To replace an image, use the same name as the current `.webp` (for example `project1.png` replaces `project1.webp`).
2. Run `npm run images` (add `-- --dry-run` to preview it first). Each image is resized, converted to WebP and the original is deleted.
3. Reference the `.webp` file in the code; the command lists any file that still points to the original name.

| Folder                   | Result                             |
| ------------------------ | ---------------------------------- |
| `system/apps/`           | App icon, 144 × 144 px             |
| `webs/`                  | Web project preview, 1280 px wide  |
| `mobile/`                | Mobile screenshot, full resolution |
| `system/background_xp.*` | Desktop background, 2560 px wide   |
| `system/logo_xp.*`       | Logo, 440 px wide                  |
| `system/avatar_xp.*`     | Avatar, 256 × 256 px               |
| Anywhere else            | Up to 1920 px wide                 |

The favicon, the Apple touch icon and the Open Graph image keep their PNG/JPG format and are never converted.

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
