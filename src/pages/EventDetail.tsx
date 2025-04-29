
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, isUserRegistered, registerForEvent, cancelRegistration, getEventRegistrations } from "@/lib/event-service";
import { Event, Registration } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const eventData = getEventById(id);
    if (eventData) {
      setEvent(eventData);
      
      if (currentUser) {
        setIsRegistered(isUserRegistered(currentUser.id, id));
        
        // If user is the organizer, fetch registrations
        if (currentUser.id === eventData.createdBy) {
          setRegistrations(getEventRegistrations(id));
        }
      }
    }
    
    setLoading(false);
  }, [id, currentUser]);

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!currentUser || !event) return;

    const result = registerForEvent(currentUser.id, event.id);
    
    if (result) {
      setIsRegistered(true);
      toast({
        title: "Registration successful",
        description: `You are now registered for "${event.title}"`,
      });
    } else {
      toast({
        title: "Registration failed",
        description: "You are already registered for this event",
        variant: "destructive",
      });
    }
  };

  const handleCancelRegistration = () => {
    if (!currentUser || !event) return;

    const success = cancelRegistration(currentUser.id, event.id);
    
    if (success) {
      setIsRegistered(false);
      toast({
        title: "Registration cancelled",
        description: `Your registration for "${event.title}" has been cancelled`,
      });
    }
  };

  const isOrganizer = currentUser && event && currentUser.id === event.createdBy;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sjsu-blue"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/events")}>Browse Events</Button>
      </div>
    );
  }

  const formattedDate = format(new Date(event.dateTime), "EEEE, MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-muted">
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-sjsu-gold text-black">{event.category}</Badge>
                {isOrganizer && (
                  <Badge variant="outline" className="border-sjsu-blue text-sjsu-blue">
                    You're the organizer
                  </Badge>
                )}
                {isRegistered && !isOrganizer && (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    Registered
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-6">{formattedDate}</p>
              
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Location</h2>
                <p className="text-gray-700">{event.location}</p>
              </div>
              
              <div>
                <h2 className="font-semibold text-lg mb-2">Organized by</h2>
                <p className="text-gray-700">{event.organizer?.name || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Registration</h2>
              
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="mb-4 text-gray-600">Please login to register for this event</p>
                  <Button 
                    className="w-full bg-sjsu-blue hover:bg-sjsu-blue/90"
                    onClick={() => navigate("/login")}
                  >
                    Login to Register
                  </Button>
                </div>
              ) : isOrganizer ? (
                <div className="py-4">
                  <p className="mb-4 text-gray-600">You are the organizer of this event.</p>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      className="border-sjsu-blue text-sjsu-blue hover:bg-sjsu-blue/10"
                      onClick={() => navigate(`/edit-event/${event.id}`)}
                    >
                      Edit Event
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        // Add delete confirmation logic here
                        toast({
                          title: "Delete not implemented",
                          description: "Event deletion will be added in a future update",
                        });
                      }}
                    >
                      Delete Event
                    </Button>
                  </div>
                </div>
              ) : isRegistered ? (
                <div className="py-4">
                  <p className="mb-4 text-gray-600">You are registered for this event.</p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelRegistration}
                  >
                    Cancel Registration
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <p className="mb-4 text-gray-600">Register now to attend this event!</p>
                  <Button
                    className="w-full bg-sjsu-blue hover:bg-sjsu-blue/90"
                    onClick={handleRegister}
                  >
                    Register for Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isOrganizer && registrations.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Registrations ({registrations.length})</h2>
                <ul className="space-y-3">
                  {registrations.map(reg => (
                    <li key={reg.id} className="border-b pb-2 last:border-0">
                      <div className="font-medium">{reg.user?.name}</div>
                      <div className="text-sm text-gray-500">{reg.user?.email}</div>
                      <div className="text-xs text-gray-400">
                        Registered: {format(new Date(reg.registrationTime), "MMM d, yyyy")}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
