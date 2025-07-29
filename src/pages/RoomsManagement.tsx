import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { rooms, getRoomsByOrganization } from '@/data/mockData';
import { MapPin, Users, Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RoomsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user) return null;

  const orgRooms = getRoomsByOrganization(user.organizationId);
  const filteredRooms = orgRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRoom = (roomId: string, roomName: string) => {
    toast({
      title: "Sala removida",
      description: `A sala "${roomName}" foi removida com sucesso.`,
    });
  };

  const handleEditRoom = (roomId: string) => {
    toast({
      title: "Edição de sala",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Salas</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie as salas da sua organização
          </p>
        </div>
        
        <Button className="bg-gradient-primary hover:shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nova Sala
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar salas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Total: {orgRooms.length} salas
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Ativas: {orgRooms.length}
          </Badge>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-card transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {room.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEditRoom(room.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDeleteRoom(room.id, room.name)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Capacity and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{room.capacity} pessoas</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">R$ {room.pricePerHour}/h</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Disponibilidade</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {room.availability.startTime} às {room.availability.endTime}
                </div>
                <div className="flex gap-1">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                    <div
                      key={day}
                      className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                        room.availability.days.includes(index)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Equipamentos</span>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {room.equipment.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.equipment.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Agenda
                </Button>
                <Button size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'Nenhuma sala encontrada' : 'Nenhuma sala cadastrada'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando sua primeira sala para começar a receber reservas'
              }
            </p>
            {!searchTerm && (
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeira Sala
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};