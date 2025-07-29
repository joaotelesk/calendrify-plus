import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rooms, events, getEventsByOrganization } from '@/data/mockData';
import { Calendar, Users, MapPin, Clock, TrendingUp, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  
  if (!user) return null;
  
  const orgEvents = getEventsByOrganization(user.organizationId);
  const upcomingEvents = orgEvents
    .filter(event => event.startDate > new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3);

  const stats = {
    totalRooms: rooms.filter(room => room.organizationId === user.organizationId).length,
    totalEvents: orgEvents.length,
    upcomingEvents: upcomingEvents.length,
    revenue: orgEvents.reduce((acc, event) => acc + event.price, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user.name}!
          </p>
        </div>
        
        {(isAdmin || isTeacher) && (
          <Button asChild className="bg-gradient-primary hover:shadow-primary">
            <Link to={isAdmin ? "/rooms" : "/create-event"}>
              <Plus className="mr-2 h-4 w-4" />
              {isAdmin ? 'Nova Sala' : 'Criar Evento'}
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Total de Salas' : 'Salas Disponíveis'}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isStudent ? 'Eventos Disponíveis' : 'Total de Eventos'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde a semana passada
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Nas próximas 2 semanas
            </p>
          </CardContent>
        </Card>

        {(isAdmin || isTeacher) && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.revenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% desde o mês passado
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Próximos Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Eventos programados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum evento programado
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const room = rooms.find(r => r.id === event.roomId);
                return (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {room?.name} • {format(event.startDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {event.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                        {event.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            Público
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        R$ {event.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.attendees.length} inscritos
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <Button variant="outline" asChild className="w-full">
              <Link to="/agenda">Ver Agenda Completa</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Salas em Destaque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Salas em Destaque
            </CardTitle>
            <CardDescription>
              Salas mais utilizadas e populares
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms
              .filter(room => room.organizationId === user.organizationId)
              .slice(0, 3)
              .map((room) => (
                <div key={room.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Capacidade: {room.capacity} pessoas
                    </p>
                    <p className="text-sm font-medium text-primary">
                      R$ {room.pricePerHour}/hora
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={isTeacher ? "/create-event" : "/available-rooms"}>
                      {isTeacher ? 'Reservar' : 'Ver'}
                    </Link>
                  </Button>
                </div>
              ))}
            <Button variant="outline" asChild className="w-full">
              <Link to={isAdmin ? "/rooms" : "/available-rooms"}>
                {isAdmin ? 'Gerenciar Salas' : 'Ver Todas as Salas'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};