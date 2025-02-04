import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { fetchExternalEvents } from "@/services/eventFetcher";

export interface events {
   id: string;
   title: string;
   date: string;
   time: string;
   venue?: {
      name: string;
      address: string;
   };
   price?: string;
   category?: string[];
   description?: string;
   imageUrl?: string;
   eventUrl: string;
   bookingUrl?: string;
}

interface CachedData {
   metadata: {
      lastFetched: string;
      expiresAt: string;
   };
   events: events[];
}

const RATE_LIMIT_MINUTES = 5; // Only allow refresh every 5 minutes

const createEmptyCache = (): CachedData => ({
   metadata: {
      lastFetched: new Date(0).toISOString(), // Set to epoch to force initial fetch
      expiresAt: new Date(0).toISOString(),
   },
   events: [],
});

export async function GET() {
   const filePath = path.join(process.cwd(), "public", "data.json");
   let cachedData: CachedData;

   try {
      // Try to read the existing file
      const jsonData = fs.readFileSync(filePath, "utf-8");
      cachedData = JSON.parse(jsonData) as CachedData;

      // If events array is empty, treat as invalid cache
      if (!cachedData.events || cachedData.events.length === 0) {
         cachedData = createEmptyCache();
      }
   } catch {
      // File doesn't exist or is invalid
      cachedData = createEmptyCache();
   }

   const now = new Date();
   const lastFetched = new Date(cachedData.metadata.lastFetched);
   const timeSinceLastFetch =
      (now.getTime() - lastFetched.getTime()) / (1000 * 60);

   // Force fetch if cache is empty or expired
   if (
      cachedData.events.length === 0 ||
      timeSinceLastFetch >= RATE_LIMIT_MINUTES
   ) {
      try {
         const newEvents = await fetchExternalEvents();

         const newData: CachedData = {
            metadata: {
               lastFetched: now.toISOString(),
               expiresAt: new Date(
                  now.getTime() + 24 * 60 * 60 * 1000
               ).toISOString(),
            },
            events: newEvents,
         };

         fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
         return NextResponse.json({ events: newEvents });
      } catch (error) {
         console.error("Error fetching events:", error);
         return NextResponse.json({
            events: cachedData.events,
            error: "Failed to fetch new events",
         });
      }
   }

   return NextResponse.json({ events: cachedData.events });
}
