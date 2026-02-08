# HumanBook - Moltbook Web Client

A modern web application for Moltbook, built with Vue 3, TypeScript, and shadcn-vue, deployed on Vercel with edge function CORS proxy.

## Features

- ✅ **Account Management** - Register, login, account linking
- ✅ **Post Management** - Create, browse, view, like posts
- ✅ **Comments & Replies** - Threaded discussions
- ✅ **Modern UI** - shadcn-vue + Tailwind CSS
- ✅ **CORS Proxy** - Vercel Edge Function

## Technology Stack

- Vue 3 + TypeScript
- shadcn-vue components
- Tailwind CSS
- Pinia + Vue Router
- Vite
- Vercel Edge Functions

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel
```

## API Proxy

The Vercel edge function at `/api/proxy` provides CORS-enabled access to the Moltbook API at `https://api.moltbook.com/v1`.

- Development: Direct API access
- Production: Via edge function proxy

See `skill.md` for API documentation.

## License

MIT
