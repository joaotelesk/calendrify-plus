import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Event, Room } from '@/types';
import { eventService, roomService } from '@/services/api';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch events created by user
        const userEvents = await eventService.getByOrganizer(user.id);
        setEvents(userEvents);
        
        // Fetch rooms for organization
        if (user.organizationId) {
          const roomsData = await roomService.getByOrganization(user.organizationId);
          setRooms(roomsData);
        }
        
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, user?.organizationId]);

  const confirmedEvents = events.filter(event => event.status === 'confirmed');
  const pendingEvents = events.filter(event => event.status === 'pending');

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.delete(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const room = rooms.find(r => r.id === event.roomId);
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
              {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(event.startDate), "dd/MM/yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {format(new Date(event.startDate), "HH:mm")} - {format(new Date(event.endDate), "HH:mm")}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {room?.name || 'Sala não encontrada'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              {event.attendees?.length || 0} participantes
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeleteEvent(event.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Eventos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os eventos que você criou
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({events.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmados ({confirmedEvents.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não criou nenhum evento</p>
                <Button className="mt-4" asChild>
                  <a href="/events/create">Criar Primeiro Evento</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhum evento confirmado</p>
              </CardContent>
            </Card>
          ) : (
            confirmedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhum evento pendente</p>
              </CardContent>
            </Card>
          ) : (
            pendingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}