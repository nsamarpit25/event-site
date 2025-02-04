import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

export async function GET() {
   const filePath = path.join(process.cwd(), "public", "data.json");
   const jsonData = fs.readFileSync(filePath, "utf-8");
   const events = JSON.parse(jsonData);

   return NextResponse.json({ events: events as events[] });
}
