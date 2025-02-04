"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import type { events } from "./api/events/route";
import EventCard from "@/components/EventCard";
import BookingModal from "@/components/BookingModal";

export default function Home() {
   const [events, setEvents] = useState<events[]>([]);
   const [selectedEvent, setSelectedEvent] = useState<events | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const { data } = await axios.get(`${baseUrl}/api/events`);
            setEvents(data.events);
         } catch (error) {
            console.error("Failed to fetch events:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchEvents();
   }, []);

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   return (
      <main className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
               Upcoming Events
            </h1>
            <p className="mt-2 text-gray-600">
               Discover and book amazing events
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
               <EventCard
                  key={event.id}
                  event={event}
                  onBookTicket={setSelectedEvent}
               />
            ))}
         </div>

         <BookingModal
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
         />
      </main>
   );
}
