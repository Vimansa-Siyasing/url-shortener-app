# URL Shortener with Click Analytics

A full-stack URL shortener. Paste a long URL, get a short link, and every visit to the short link is counted.

## Features

- Generate a unique 6-character short code for any URL
- Redirect short links to the original URL
- Track the number of clicks on each link
- Stats endpoint that returns the click count and creation date
- React frontend served directly by the Express backend

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Backend  | Node.js, Express                   |
| Database | MongoDB Atlas, Mongoose            |
| Frontend | React (Vite)                       |
| Other    | nanoid, dotenv, cors, nodemon      |

## Project Structure

```
url-shortener-app/
├── models/
│   └── Link.js          # Mongoose schema (originalUrl, shortCode, clicks, createdAt)
├── frontend/            # React app (Vite)
│   └── src/
│       ├── App.jsx
│       └── App.css
├── server.js            # Express server and API routes
├── package.json
└── .env                 # Not committed (MongoDB connection string)
```

## API Endpoints

| Method | Endpoint            | Description                                      |
| ------ | ------------------- | ------------------------------------------------ |
| POST   | `/shorten`          | Create a short link. Body: `{ "originalUrl": "https://example.com" }` |
| GET    | `/:code`            | Redirect to the original URL and increment clicks |
| GET    | `/api/stats/:code`  | Get `clicks` and `createdAt` for a short code    |

Example response from `POST /shorten`:

```json
{ "shortUrl": "http://localhost:3000/aB3xYz" }
```

Example response from `GET /api/stats/aB3xYz`:

```json
{ "clicks": 4, "createdAt": "2026-10-03T10:15:00.000Z" }
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB Atlas account (a free M0 cluster is enough)

### 1. Clone and install

```bash
git clone https://github.com/Vimansa-Siyasing/url-shortener-app.git
cd url-shortener-app
npm install
cd frontend
npm install
cd ..
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
MONGO_URI=your_mongodb_atlas_connection_string
BASE_URL=http://localhost:3000
PORT=3000
```

`BASE_URL` and `PORT` are optional and default to `http://localhost:3000` and `3000`.

### 3. Run it

**Development** (backend and frontend run separately with hot reload):

```bash
# Terminal 1: backend
npm run dev

# Terminal 2: frontend
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:3000`.

**Production-style** (Express serves the built React app):

```bash
cd frontend
npm run build
cd ..
node server.js
```

Open `http://localhost:3000`.

## Roadmap

- [ ] Validate that submitted URLs are valid `http`/`https` URLs
- [ ] Show the click count in the frontend
- [ ] Handle short-code collisions with a unique index and retry
- [ ] Deploy to AWS EC2

## Author

**Vimansa Siyasinghe**
[GitHub](https://github.com/Vimansa-Siyasing) · [LinkedIn](https://linkedin.com/in/vimansa-siyasinghe-1b74103a8)
