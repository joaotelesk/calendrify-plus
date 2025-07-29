import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { getRoomsByOrganization } from '@/data/mockData';
import { ChevronLeft, ChevronRight, MapPin, Users, Monitor, Wifi, Car, CreditCard, Calendar as CalendarIcon, Clock, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const CreateEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('1');
  const [recurrence, setRecurrence] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!user) return null;

  const orgRooms = getRoomsByOrganization(user.organizationId);
  const selectedRoomData = orgRooms.find(room => room.id === selectedRoom);

  // Horários disponíveis (mock)
  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Alguns horários já ocupados (mock)
  const occupiedTimes = [
    { time: '10:00', professor: 'Prof. João' },
    { time: '16:00', professor: 'Prof. Maria' }
  ];

  const calculatePrice = () => {
    if (!selectedRoomData || !duration) return 0;
    return parseInt(duration) * selectedRoomData.pricePerHour;
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedRoom || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione sala, data e horário.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = calculatePrice();
    
    toast({
      title: "Agendamento confirmado!",
      description: `Sala reservada para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}. Valor: R$ ${totalPrice.toFixed(2)}`,
    });
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedRoom('');
    setSelectedTime('');
    setDuration('1');
    setIsRecurring(false);
  };

  const handleCancel = () => {
    setSelectedDate(undefined);
    setSelectedRoom('');
    setSelectedTime('');
    setDuration('1');
    setIsRecurring(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="relative">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {selectedRoomData ? `Agendar ${selectedRoomData.name}` : 'Agendar Sala'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione data, horário e configure sua aula
              </p>
            </div>
          </div>
        </CardHeader>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Calendar */}
          <div className="p-6 border-r">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center">
                  <span className="text-xs">📅</span>
                </div>
                <h3 className="font-medium">Selecionar Data</h3>
              </div>

              {/* Room Selector */}
              <div className="space-y-2">
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto rounded-md border"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Time Slots */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-5 h-5 rounded border-2 border-primary flex items-center justify-center">
                  <span className="text-xs">🕒</span>
                </div>
                <h3 className="font-medium">Horários Disponíveis</h3>
              </div>

              {selectedDate && selectedRoom ? (
                <div className="space-y-4">
                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => {
                      const isOccupied = occupiedTimes.find(ot => ot.time === time);
                      const isSelected = selectedTime === time;
                      
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                          className={cn(
                            "h-12 text-sm",
                            isOccupied && "opacity-50 cursor-not-allowed",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                          onClick={() => !isOccupied && setSelectedTime(time)}
                          disabled={!!isOccupied}
                        >
                          <div className="text-center">
                            <div>{time}</div>
                            {isOccupied && (
                              <div className="text-xs opacity-70">
                                {isOccupied.professor}
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Duration Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duração da Aula</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="3">3 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recurring Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                    />
                    <label htmlFor="recurring" className="text-sm font-medium">
                      🔄 Aula Recorrente
                    </label>
                  </div>

                  {/* Summary */}
                  {selectedTime && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-3">Resumo do Agendamento</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Sala:</span>
                          <span>{selectedRoomData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data:</span>
                          <span>{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Horário:</span>
                          <span>{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duração:</span>
                          <span>{duration} {parseInt(duration) === 1 ? 'hora' : 'horas'}</span>
                        </div>
                        {selectedRoomData && (
                          <div className="flex justify-between font-medium text-primary">
                            <span>Total:</span>
                            <span>R$ {calculatePrice().toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Selecione uma sala e data primeiro</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between p-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90"
            disabled={!selectedDate || !selectedRoom || !selectedTime}
          >
            Confirmar Agendamento
          </Button>
        </div>
      </Card>
    </div>
  );
};