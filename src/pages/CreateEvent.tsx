import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { rooms, getRoomsByOrganization } from '@/data/mockData';
import { CalendarIcon, MapPin, Users, Clock, DollarSign, Globe, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const CreateEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxAttendees: '',
    isPublic: true,
  });

  if (!user) return null;

  const orgRooms = getRoomsByOrganization(user.organizationId);
  const selectedRoomData = orgRooms.find(room => room.id === selectedRoom);

  const calculatePrice = () => {
    if (!selectedRoomData || !eventData.startTime || !eventData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${eventData.startTime}`);
    const end = new Date(`2000-01-01T${eventData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return hours * selectedRoomData.pricePerHour;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedRoom || !eventData.title || !eventData.startTime || !eventData.endTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = calculatePrice();
    
    toast({
      title: "Evento criado com sucesso!",
      description: `Evento "${eventData.title}" criado. Valor total: R$ ${totalPrice.toFixed(2)}`,
    });
    
    // Reset form
    setEventData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      maxAttendees: '',
      isPublic: true,
    });
    setSelectedDate(undefined);
    setSelectedRoom('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
        <p className="text-muted-foreground">
          Reserve uma sala e crie um evento para sua organização
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
                <CardDescription>
                  Preencha os detalhes do seu evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Workshop de React Avançado"
                    value={eventData.title}
                    onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que será abordado no evento..."
                    value={eventData.description}
                    onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data do Evento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Horário de Início *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={eventData.startTime}
                      onChange={(e) => setEventData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Horário de Término *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Máximo de Participantes</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="Ex: 30"
                    value={eventData.maxAttendees}
                    onChange={(e) => setEventData(prev => ({ ...prev, maxAttendees: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={eventData.isPublic}
                    onCheckedChange={(checked) => setEventData(prev => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="isPublic" className="flex items-center gap-2">
                    {eventData.isPublic ? (
                      <Globe className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-orange-600" />
                    )}
                    Evento público
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {eventData.isPublic 
                    ? "Qualquer pessoa poderá se inscrever no evento através de um link público"
                    : "Apenas membros da organização poderão participar"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Escolher Sala</CardTitle>
                <CardDescription>
                  Selecione a sala para o evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {room.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedRoomData && (
                  <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                    <h4 className="font-medium">{selectedRoomData.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Capacidade: {selectedRoomData.capacity} pessoas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>R$ {selectedRoomData.pricePerHour}/hora</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedRoomData.availability.startTime} às {selectedRoomData.availability.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Equipamentos:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedRoomData.equipment.slice(0, 2).map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                        {selectedRoomData.equipment.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedRoomData.equipment.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Valor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedRoomData && eventData.startTime && eventData.endTime ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Duração:</span>
                      <span>
                        {((new Date(`2000-01-01T${eventData.endTime}`).getTime() - 
                           new Date(`2000-01-01T${eventData.startTime}`).getTime()) / 
                           (1000 * 60 * 60))} horas
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valor por hora:</span>
                      <span>R$ {selectedRoomData.pricePerHour}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-primary">R$ {calculatePrice().toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Pagamento será processado via Mercado Pago
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Selecione uma sala e horários para ver o valor
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-gradient-primary hover:shadow-primary">
              Criar Evento e Prosseguir para Pagamento
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};