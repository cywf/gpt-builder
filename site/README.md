# GPT Builder Documentation Site

This directory contains the Astro-based documentation and demo site for GPT Builder, deployed to GitHub Pages.

## Overview

The site provides:
- **Project Information** - README excerpts, features, tech stack
- **Static Demo** - Read-only demo of the dashboard with sample data
- **Statistics** - Repository metrics, language breakdown, commit activity
- **Discussions** - GitHub discussions feed
- **Development Board** - Kanban view of project tasks
- **Create Issue** - Guided issue creation
- **Documentation** - Rendered markdown docs with syntax highlighting
- **Visualizer** - Mermaid diagram viewer

## Tech Stack

- **Astro 5.0** - Static site generator
- **React 18.3** - Interactive components
- **TailwindCSS 3.4** - Styling
- **daisyUI 4.12** - Component library with dark themes
- **Chart.js 4.4** - Statistics visualization
- **Mermaid 11.4** - Diagram rendering
- **TypeScript 5.7** - Type safety

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck
```

## Themes

The site includes 7 dark-first themes:
1. **nightfall** (default) - Deep blue with purple accents
2. **dracula** - Popular dark theme
3. **cyberpunk** - Vibrant neon colors
4. **dark-neon** - High contrast neon
5. **hackerman** - Matrix-inspired green
6. **gamecore** - Gaming-inspired purple/pink
7. **neon-accent** - Modern neon accents

Theme selection is persisted in localStorage.

## Data Sources

### Static Data (committed)
- `public/demo/*.json` - Demo profiles, prompts, templates

### Dynamic Data (CI-generated)
- `public/data/stats.json` - Repository statistics
- `public/data/discussions.json` - Recent discussions
- `public/data/projects.json` - Project board items

Data fetching scripts in `scripts/` are run during GitHub Actions deployment.

## Deployment

The site is automatically deployed to GitHub Pages via the `.github/workflows/pages.yml` workflow:

1. **Trigger**: Push to `main` branch
2. **Fetch Data**: Run data fetching scripts with `GITHUB_TOKEN`
3. **Build**: `npm run build` generates static site
4. **Deploy**: Upload to GitHub Pages

URL: https://cywf.github.io/gpt-builder/

## Configuration

### Base Path
The site is configured with base path `/gpt-builder` in `astro.config.mjs`.

### Environment Variables
- `PUBLIC_DEFAULT_THEME` - Default theme (default: `nightfall`)

## Project Structure

```
site/
├── src/
│   ├── components/      # React components
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Route pages
│   └── styles/          # Global styles
├── public/
│   ├── data/            # CI-generated data (gitignored)
│   └── demo/            # Static demo data
├── scripts/             # Data fetching scripts
└── dist/                # Build output (gitignored)
```

## License

MIT - See [LICENSE](../LICENSE) in repository root.
