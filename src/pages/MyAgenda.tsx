import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MapPin, Users } from 'lucide-react';

export const MyAgenda = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (!user) return null;

  // Mock: eventos do usuário baseado na organização
  const userEvents = events.filter(event => 
    event.organizationId === user.organizationId &&
    (event.createdBy === user.id || event.attendees?.some(attendee => attendee.userId === user.id))
  );

  const selectedDateEvents = userEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minha Agenda</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seus eventos agendados
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Events for selected date */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Eventos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum evento agendado para esta data
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                              {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.roomName}
                            </div>
                            {event.attendees && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.attendees.length} participantes
                              </div>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          )}
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};