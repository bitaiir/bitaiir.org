# bitaiir.org

Official website of the [BitAiir](https://github.com/bitaiir/bitaiir) cryptocurrency project.

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com).
Content is available in English and Brazilian Portuguese (PT-BR).

## Development

Requires Node.js `>= 20` and [pnpm](https://pnpm.io) (via `corepack enable pnpm`).

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static output in ./dist
pnpm preview   # preview the production build
```

## Project layout

```
src/
├── content/         # MDX docs, per-locale
├── i18n/            # UI strings, per-locale
├── layouts/         # page layouts
├── components/      # shared components
├── pages/           # routes (root + [lang]/…)
└── styles/          # global Tailwind stylesheet + theme tokens
public/              # favicons, logos, static assets
```

## License

[MIT](LICENSE) — see the `LICENSE` file.
