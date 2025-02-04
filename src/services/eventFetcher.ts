import axios from "axios";

export interface Event {
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
   price?: string;
   category?: string[];
}

export interface EventData {
   id: string;
   attributes: {
      name: string;
      description: string;
      "original-image-url"?: string;
      "logo-url"?: string;
      "ticket-url"?: string;
      "starts-at": string;
      "location-name"?: string;
      "searchable-location-name"?: string;
      "is-donation-enabled"?: boolean;
   };
   relationships?: {
      "event-type"?: {
         links: {
            related: string;
         };
      };
   };
}

const API_BASE_URL = "https://api.eventyay.com/v1";

export async function fetchEvents(): Promise<Event[]> {
   try {
      // Directly fetch events instead of event types
      const response = await axios.get(
         `${API_BASE_URL}/events?sort=starts-at&page[size]=5`
      );
      console.log("Initial events:", response.data.data[0]);

      // Map the events directly
      const events = await Promise.all(
         response.data.data.map((eventData: EventData) => ({
            id: eventData.id,
            title: eventData.attributes?.name || "",
            description: eventData.attributes?.description || "",
            imageUrl:
               eventData.attributes?.["original-image-url"] ||
               eventData.attributes?.["logo-url"] ||
               "",
            eventUrl: eventData.attributes?.["ticket-url"] || "",
            date:
               new Date(
                  eventData.attributes?.["starts-at"]
               ).toLocaleDateString() || "",
            time:
               new Date(
                  eventData.attributes?.["starts-at"]
               ).toLocaleTimeString() || "",
            venue: eventData.attributes?.["location-name"]
               ? {
                    name: eventData.attributes["location-name"],
                    address:
                       eventData.attributes["searchable-location-name"] || "",
                 }
               : undefined,
            price: eventData.attributes?.["is-donation-enabled"]
               ? "Donation"
               : "Free",
            category: eventData.relationships?.["event-type"]?.links
               ? [eventData.relationships["event-type"].links.related]
               : undefined,
         }))
      );

      return events.filter((event): event is Event => event !== null);
   } catch (error) {
      console.error("Error fetching events:", error);
      return [];
   }
}

export async function fetchExternalEvents(): Promise<Event[]> {
   const events = await fetchEvents();
   console.log(events);
   return events;
}
