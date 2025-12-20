# Site Portfolio Professionnel

> Template de site portfolio moderne pour professionnels (santé, services, indépendants)

---

## Stack Technique

### Core

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16.1.0 | Framework React avec SSR/SSG, App Router |
| **React** | 19.2.3 | Bibliothèque UI |
| **TypeScript** | 5.9.3 | Typage statique |
| **Tailwind CSS** | 4.1.18 | Framework CSS utility-first |

### Outils de développement

| Outil | Version | Rôle |
|-------|---------|------|
| **Bun** | - | Gestionnaire de paquets (plus rapide que npm/yarn) |
| **Biome** | 2.3.10 | Linter + Formatter (remplace ESLint + Prettier) |
| **PostCSS** | - | Traitement CSS pour Tailwind |

### UI & Design

| Option | Usage |
|--------|-------|
| **shadcn/ui** | Composants UI accessibles et personnalisables (basé sur Radix UI) |
| **Skill frontend-design** | Génération de composants avec Claude Code |

```bash
# Installation shadcn/ui
bunx shadcn@latest init
bunx shadcn@latest add button card dialog
```

### Intégrations externes

| Service | Usage |
|---------|-------|
| **Calendly** | Système de réservation en ligne (embed widget) |
| **Google Fonts** | Typographies web |

---

## Structure du projet

```
/project
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout racine + metadata SEO
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux + animations
│   ├── robots.ts          # Configuration robots.txt
│   ├── sitemap.ts         # Génération sitemap XML
│   └── not-found.tsx      # Page 404
│
├── components/             # Composants React
│
├── public/                 # Assets statiques
│
├── next.config.ts         # Config Next.js (redirects, headers sécurité)
├── tsconfig.json          # Configuration TypeScript
├── postcss.config.mjs     # Configuration PostCSS
├── biome.json             # Configuration Biome
├── package.json           # Dépendances & scripts
└── bun.lock               # Lock file Bun
```

---

## Scripts disponibles

```bash
bun dev              # Serveur de développement
bun run build        # Build production
bun start            # Serveur production
bun run lint         # Linter Biome
bun run format       # Formatter Biome
bun run check        # Lint + format
```

---

## Configuration

### next.config.ts
- Redirections (www → non-www)
- Headers de sécurité (HSTS, X-Frame-Options, X-Content-Type-Options)

### biome.json
- Linter activé avec règles recommandées
- Formatter avec indentation tabs
- Support CSS/Tailwind

### tsconfig.json
- Target ES2017, strict mode
- Path alias: `@/*` → racine

---

## SEO

- **Metadata Next.js** → title, description, keywords, Open Graph, Twitter Cards
- **JSON-LD** → Structured data (ProfessionalService, Person, FAQPage, etc.)
- **robots.ts** → Configuration crawlers
- **sitemap.ts** → Sitemap XML dynamique

---

## Internationalisation (i18n)

### Librairie recommandée

**next-intl** → Solution i18n pour Next.js App Router

```bash
bun add next-intl
```

### Structure avec i18n

```
/project
├── app/
│   └── [locale]/           # Route dynamique par langue
│       ├── layout.tsx
│       └── page.tsx
├── messages/               # Fichiers de traduction
│   ├── fr.json
│   └── en.json
├── i18n/
│   ├── request.ts          # Configuration locale
│   └── routing.ts          # Définition des locales
└── middleware.ts           # Redirection automatique par langue
```

### Configuration

```typescript
// i18n/routing.ts
export const locales = ['fr', 'en'] as const;
export const defaultLocale = 'fr';
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

export default createMiddleware({ locales, defaultLocale });
```

### Utilisation

```tsx
// Composant
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');
  return <h1>{t('title')}</h1>;
}
```

```json
// messages/fr.json
{
  "Hero": {
    "title": "Bienvenue"
  }
}
```

---

## Déploiement

**Plateforme:** Railway

### Variable d'environnement

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

---

## Licence

Projet privé - Tous droits réservés
