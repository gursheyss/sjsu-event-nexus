
import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import EventFilter from "@/components/EventFilter";
import { getEvents, getEventsByCategory } from "@/lib/event-service";
import { Event } from "@/types";

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize events
  useEffect(() => {
    const allEvents = getEvents();
    setEvents(allEvents);
    setFilteredEvents(allEvents);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = selectedCategory === "All" ? events : getEventsByCategory(selectedCategory);
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        event =>
          event.title.toLowerCase().includes(lowerCaseSearch) ||
          event.description.toLowerCase().includes(lowerCaseSearch) ||
          event.location.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    setFilteredEvents(result);
  }, [selectedCategory, searchTerm, events]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Events</h1>
      
      <EventFilter
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sjsu-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try a different search term or category."
              : "There are no events in this category yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
