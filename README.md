# Spieletreff Tecklenburg

Website project for Spieletreff Tecklenburg, built with SvelteKit, TypeScript, and Tailwind CSS.

## Tech Stack

- SvelteKit 2
- Svelte 5
- TypeScript
- Tailwind CSS 4
- Vite 7
- pnpm

## Requirements

- Node.js 22+
- pnpm

## Local Development

Install dependencies:

```bash
pnpm install
```

Start dev server:

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - start development server
- `pnpm build` - create production build
- `pnpm preview` - preview production build locally
- `pnpm check` - run Svelte/TypeScript checks
- `pnpm lint` - run Prettier check and ESLint
- `pnpm format` - format codebase with Prettier

## Project Structure

- `src/` - app source code (routes, components, styles)
- `static/` - static assets
- `build/` - generated build output

## Notes

- Adapter is configured for static output (`@sveltejs/adapter-static`).
- Design direction and visual system are documented in `DESIGN.md`.

