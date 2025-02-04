"use client";

import Image from "next/image";
import { events } from "@/app/api/events/route";
import { motion } from "framer-motion";

interface Props {
   event: events;
   onBookTicket: (event: events) => void;
}

export default function EventCard({ event, onBookTicket }: Props) {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105"
      >
         <div className="relative h-56">
            <Image
               src={event.imageUrl || "/default-event.jpg"}
               alt={event.title}
               fill
               className="object-cover"
            />
            {event.category && event.category.length > 0 && (
               <div className="absolute top-4 left-4 flex gap-2">
                  {event.category.map((cat) => (
                     <span
                        key={cat}
                        className="px-3 py-1 bg-black/70 text-white text-sm rounded-full"
                     >
                        {cat}
                     </span>
                  ))}
               </div>
            )}
         </div>
         <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">
               {event.title}
            </h3>
            <div className="space-y-2 mb-4">
               <div className="flex items-center text-gray-600">
                  <svg
                     className="w-5 h-5 mr-2"
                     fill="none"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                     {event.date} • {event.time}
                  </span>
               </div>
               {event.venue && (
                  <div className="flex items-center text-gray-600">
                     <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                     <span>{event.venue.name}</span>
                  </div>
               )}
               {event.price && (
                  <div className="flex items-center text-gray-600">
                     <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span>{event.price}</span>
                  </div>
               )}
            </div>
            <button
               onClick={() => onBookTicket(event)}
               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1"
            >
               Get Tickets
            </button>
         </div>
      </motion.div>
   );
}
