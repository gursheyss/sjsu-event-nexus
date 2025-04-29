
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserRegistrations, getEventsByOrganizer, cancelRegistration, deleteEvent } from "@/lib/event-service";
import { Event, Registration } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!currentUser) return;

    setLoading(true);
    
    // Get user registrations
    const registrations = getUserRegistrations(currentUser.id);
    setUserRegistrations(registrations);
    
    // Get created events if user is an organizer
    if (currentUser.role === "organizer") {
      const events = getEventsByOrganizer(currentUser.id);
      setCreatedEvents(events);
    }
    
    setLoading(false);
  }, [currentUser, isAuthenticated, navigate]);

  const handleCancelRegistration = (eventId: string) => {
    if (!currentUser) return;
    
    const success = cancelRegistration(currentUser.id, eventId);
    
    if (success) {
      setUserRegistrations(userRegistrations.filter(reg => reg.eventId !== eventId));
      
      toast({
        title: "Registration cancelled",
        description: "Your registration has been cancelled successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const success = deleteEvent(eventId);
    
    if (success) {
      setCreatedEvents(createdEvents.filter(event => event.id !== eventId));
      
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !currentUser) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sjsu-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-sjsu-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-600">{currentUser.email}</p>
              <Badge className="mt-2 bg-sjsu-gold text-black">
                {currentUser.role === "organizer" ? "Event Organizer" : "Student Participant"}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registrations">My Registrations</TabsTrigger>
            {currentUser.role === "organizer" && (
              <TabsTrigger value="events">My Events</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="registrations" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Registered Events</h2>
            
            {userRegistrations.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600">No registered events</h3>
                <p className="text-gray-500 mt-2">Browse events to find something interesting!</p>
                <Button 
                  className="mt-4 bg-sjsu-blue hover:bg-sjsu-blue/90"
                  onClick={() => navigate("/events")}
                >
                  Browse Events
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRegistrations.map((registration) => {
                  if (!registration.event) return null;
                  
                  const event = registration.event;
                  const formattedDate = format(new Date(event.dateTime), "MMM d, yyyy 'at' h:mm a");
                  
                  return (
                    <Card key={registration.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {event.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered on {format(new Date(registration.registrationTime), "MMM d, yyyy")}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelRegistration(event.id)}
                        >
                          Cancel Registration
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {currentUser.role === "organizer" && (
            <TabsContent value="events" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Events You Created</h2>
                <Button 
                  className="bg-sjsu-blue hover:bg-sjsu-blue/90"
                  onClick={() => navigate("/create-event")}
                >
                  Create New Event
                </Button>
              </div>
              
              {createdEvents.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-600">No events created yet</h3>
                  <p className="text-gray-500 mt-2">Start organizing by creating your first event!</p>
                  <Button 
                    className="mt-4 bg-sjsu-blue hover:bg-sjsu-blue/90"
                    onClick={() => navigate("/create-event")}
                  >
                    Create Event
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {createdEvents.map((event) => {
                    const formattedDate = format(new Date(event.dateTime), "MMM d, yyyy 'at' h:mm a");
                    
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">{formattedDate}</p>
                            </div>
                            <Badge>{event.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm line-clamp-2">{event.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Location:</span> {event.location}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                          <div className="space-x-2">
                            <Button 
                              variant="secondary"
                              size="sm"
                              className="bg-sjsu-gold text-black"
                              onClick={() => navigate(`/edit-event/${event.id}`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
