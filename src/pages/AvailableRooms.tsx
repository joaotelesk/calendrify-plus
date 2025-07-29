import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRoomsByOrganization } from '@/data/mockData';
import { Search, MapPin, Users, Monitor, Wifi, Car } from 'lucide-react';

export const AvailableRooms = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');

  if (!user) return null;

  const orgRooms = getRoomsByOrganization(user.organizationId);

  const filteredRooms = orgRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = capacityFilter === 'all' || 
                           (capacityFilter === 'small' && room.capacity <= 10) ||
                           (capacityFilter === 'medium' && room.capacity > 10 && room.capacity <= 30) ||
                           (capacityFilter === 'large' && room.capacity > 30);

    return matchesSearch && matchesCapacity;
  });

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'Projetor': return <Monitor className="h-4 w-4" />;
      case 'Wi-Fi': return <Wifi className="h-4 w-4" />;
      case 'Estacionamento': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salas Disponíveis</h1>
        <p className="text-muted-foreground">
          Explore as salas disponíveis em sua organização
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar salas por nome ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por capacidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as capacidades</SelectItem>
                <SelectItem value="small">Pequena (até 10)</SelectItem>
                <SelectItem value="medium">Média (11-30)</SelectItem>
                <SelectItem value="large">Grande (30+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    {room.location}
                  </div>
                </div>
                <Badge 
                  variant={room.isAvailable ? "default" : "secondary"}
                  className={room.isAvailable ? "bg-green-500" : ""}
                >
                  {room.isAvailable ? 'Disponível' : 'Ocupada'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Capacidade: {room.capacity} pessoas</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Recursos:</p>
                <div className="flex flex-wrap gap-2">
                  {room.resources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <div className="flex items-center gap-1">
                        {getResourceIcon(resource)}
                        {resource}
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Preço por hora:</span>
                  <span className="text-lg font-bold text-primary">
                    R$ {room.pricePerHour.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!room.isAvailable}
                >
                  {room.isAvailable ? 'Agendar Sala' : 'Indisponível'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || capacityFilter !== 'all' 
                ? 'Nenhuma sala encontrada com os filtros aplicados'
                : 'Nenhuma sala disponível no momento'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};