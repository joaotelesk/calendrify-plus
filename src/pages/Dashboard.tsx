import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Plus, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event, Room } from '@/types';
import { eventService, roomService, statsService } from '@/services/api';

interface DashboardStats {
  totalRooms: number;
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalRevenue: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.organizationId) return;
      
      try {
        setLoading(true);
        
        // Fetch stats
        const dashboardStats = await statsService.getDashboardStats(user.organizationId);
        setStats(dashboardStats);
        
        // Fetch events
        const events = await eventService.getAll({ 
          organizationId: user.organizationId,
          status: 'confirmed'
        });
        
        const upcoming = events
          .filter(event => new Date(event.startDate) > new Date())
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 5);
        setUpcomingEvents(upcoming);
        
        // Fetch rooms
        const rooms = await roomService.getByOrganization(user.organizationId);
        setFeaturedRooms(rooms.slice(0, 3));
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.organizationId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        {(isAdmin || isTeacher) && (
          <Button asChild className="gap-2">
            <Link to={isAdmin ? "/rooms/manage" : "/events/create"}>
              <Plus className="h-4 w-4" />
              {isAdmin ? "Nova Sala" : "Novo Evento"}
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
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
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
                const room = featuredRooms.find(r => r.id === event.roomId);
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
            {featuredRooms.map((room) => (
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