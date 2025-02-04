# Event Site with Next.js

A modern event aggregation platform built with Next.js 13+, leveraging the App Router and Server Components for optimal performance.

## Tech Stack

-  **Framework**: Next.js 13+ (App Router)
-  **Language**: TypeScript
-  **Styling**: Tailwind CSS
-  **API Integration**: Axios
-  **Caching**: File-based (temporary) with 24h TTL
-  **Rate Limiting**: Custom implementation
-  **State Management**: React Server Components + Client Hooks
-  **Deployment**: Vercel (recommended)

## Architecture

### API Layer

-  Custom wrapper around Eventyay API
-  Rate limiting implementation (5-minute cooldown)
-  Response transformation and normalization
-  Error boundary handling
-  Automatic retry logic

### Caching System

```typescript
interface CacheStructure {
   metadata: {
      lastFetched: string;
      expiresAt: string;
   };
   events: EventType[];
}

interface EventType {
   id: string;
   title: string;
   description: string;
   imageUrl: string;
   eventUrl: string;
   date: string;
   time: string;
   venue?: {
      name: string;
      address: string;
   };
   price: string;
   category?: string[];
}
```

### Performance Features

-  Streaming SSR
-  Optimized image loading with next/image
-  Automatic static optimization where possible
-  Intelligent cache invalidation
-  Progressive enhancement

### Directory Structure

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   ├── events/         # Events routes
│   └── api/           # API routes
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── features/      # Feature-specific components
├── services/          # Business logic & API
│   ├── eventFetcher.ts  # Event API integration
│   └── cacheManager.ts  # Cache management
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

## API Routes

### GET /api/events

Fetches events with caching and rate limiting:

```typescript
Response {
  events: EventType[];
  metadata?: {
    cached: boolean;
    lastFetched: string;
    nextUpdate: string;
  }
}
```

### Rate Limiting Logic

```typescript
const RATE_LIMIT_MINUTES = 5;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

// Rate limit check
const timeSinceLastFetch = (now - lastFetched) / (1000 * 60);
if (timeSinceLastFetch < RATE_LIMIT_MINUTES) {
   return cachedData;
}
```

## Component Architecture

### Server Components

-  EventList: Server-side rendering of event grid
-  EventDetails: Dynamic event information display
-  CategoryFilter: Server-side filtering

### Client Components

-  SearchBar: Real-time search functionality
-  FilterPanel: Interactive filtering
-  FavoriteButton: Client-side favoriting

## Setup & Development

1. **Installation**

```bash
git clone <repository-url>
cd event-site
npm install
```

2. **Environment Setup** Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.eventyay.com/v1
NEXT_PUBLIC_CACHE_DURATION=86400
NEXT_PUBLIC_RATE_LIMIT_MINUTES=5
```

3. **Development Server**

```bash
npm run dev
```

4. **Build & Production**

```bash
npm run build
npm start
```

## Data Flow

1. Client Request → Next.js Edge Runtime
2. Check Cache Status
   -  If valid & fresh → Return cached data
   -  If stale → Trigger background refresh
   -  If missing → Fetch from API
3. Transform & Normalize Data
4. Update Cache
5. Stream Response to Client

## Cache Management

The current file-based cache system (`data.json`) implements:

-  Automatic invalidation after 24 hours
-  Background refresh
-  Race condition prevention
-  Error fallback to cached data

## Future Enhancements

**Database Migration**

-  MongoDB for event data
-  Redis for caching
-  PostgreSQL for user data
