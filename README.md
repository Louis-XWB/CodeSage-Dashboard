# CodeSage Dashboard

[English](README.md) | [中文](README.zh-CN.md)

Web dashboard for [CodeSage](https://github.com/Louis-XWB/CodeSage) — visualize AI code review history, track quality trends, and monitor repositories.

## Screenshots

### Overview
![Overview](docs/screenshots/overview.png)

### Trends
![Trends](docs/screenshots/trends.png)

## Features

- **Overview** — Summary cards, recent reviews at a glance
- **Repositories** — All reviewed repos with avg score and review count
- **Repo Detail** — Score trend chart, issue breakdown, PR review history
- **Reviews** — Filterable list of all reviews across repos
- **Review Detail** — Full report with issues, commit info, and suggestions
- **Trends** — Score over time, issue severity distribution, blocked rate
- **Settings** — Configure API URL

## Quick Start

### Prerequisites

- Node.js >= 18
- [CodeSage](https://github.com/Louis-XWB/CodeSage) server running (provides the REST API)

### Install & Run

```bash
git clone https://github.com/Louis-XWB/CodeSage-Dashboard.git
cd CodeSage-Dashboard
pnpm install
pnpm dev
```

Open http://localhost:5173

### API Connection

Dashboard connects to CodeSage server API at `http://localhost:3000` by default.

To change:
- **Build time:** set `VITE_API_URL` environment variable
- **Runtime:** go to Settings page in the dashboard

### Start CodeSage Server

The dashboard needs CodeSage server running to provide data:

```bash
# In the CodeSage project directory
codesage server --port 3000
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router

## Build

```bash
pnpm build
```

Output in `dist/` — deploy to any static file server (nginx, Vercel, etc.)

## API Endpoints

Dashboard consumes these CodeSage REST API endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/history/repos` | List all reviewed repos |
| `GET /api/history/repos/:repo/stats` | Repo statistics |
| `GET /api/history` | Query review history |
| `GET /api/history/:id` | Single review detail |

## License

MIT
