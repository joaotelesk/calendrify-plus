import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';

export const MyRegistrations = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock: eventos onde o usuário está inscrito
  const registeredEvents = events.filter(event => 
    event.attendees?.some(attendee => attendee.userId === user.id)
  );

  const upcomingEvents = registeredEvents.filter(event => 
    new Date(event.date) >= new Date()
  );
  
  const pastEvents = registeredEvents.filter(event => 
    new Date(event.date) < new Date()
  );

  const EventRegistrationCard = ({ event }: { event: typeof events[0] }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
              {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
            </Badge>
            <Badge variant="outline">
              {event.isPublic ? 'Público' : 'Privado'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {event.roomName}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            Organizador: {event.createdBy}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Detalhes do Evento
          </Button>
          {new Date(event.date) >= new Date() && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <X className="h-4 w-4 mr-2" />
              Cancelar Inscrição
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Inscrições</h1>
        <p className="text-muted-foreground">
          Gerencie todos os eventos em que você está inscrito
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Passados ({pastEvents.length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({registeredEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você não tem inscrições em eventos próximos</p>
                <Button className="mt-4">Explorar Eventos</Button>
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map(event => (
              <EventRegistrationCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você não participou de nenhum evento ainda</p>
              </CardContent>
            </Card>
          ) : (
            pastEvents.map(event => (
              <EventRegistrationCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {registeredEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não se inscreveu em nenhum evento</p>
                <Button className="mt-4">Explorar Eventos</Button>
              </CardContent>
            </Card>
          ) : (
            registeredEvents.map(event => (
              <EventRegistrationCard key={event.id} event={event} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};