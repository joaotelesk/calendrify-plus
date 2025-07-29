import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPublicEvents, rooms } from '@/data/mockData';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const PublicEvents = () => {
  const publicEvents = getPublicEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Eventos Públicos</h1>
        <p className="text-muted-foreground">Participe dos eventos abertos da comunidade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicEvents.map((event) => {
          const room = rooms.find(r => r.id === event.roomId);
          return (
            <Card key={event.id} className="hover:shadow-card transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {room?.name}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {format(event.startDate, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {format(event.startDate, "HH:mm", { locale: ptBR })} - {format(event.endDate, "HH:mm", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {event.attendees.length}/{event.maxAttendees || 'Ilimitado'} inscritos
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">R$ {event.price}</Badge>
                  <Button size="sm" className="bg-gradient-primary">
                    Participar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};