import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { events } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';

export const MyEvents = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock: eventos criados pelo usuário
  const createdEvents = events.filter(event => event.createdBy === user.id);
  
  const confirmedEvents = createdEvents.filter(event => event.status === 'confirmed');
  const pendingEvents = createdEvents.filter(event => event.status === 'pending');

  const EventCard = ({ event }: { event: typeof events[0] }) => (
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
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Eventos</h1>
        <p className="text-muted-foreground">
          Gerencie todos os eventos que você criou
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({createdEvents.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmados ({confirmedEvents.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pendingEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {createdEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não criou nenhum evento</p>
                <Button className="mt-4">Criar Primeiro Evento</Button>
              </CardContent>
            </Card>
          ) : (
            createdEvents.map(event => (
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
};