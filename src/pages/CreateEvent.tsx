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

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'Projetor': return <Monitor className="h-4 w-4" />;
      case 'Wi-Fi': return <Wifi className="h-4 w-4" />;
      case 'Estacionamento': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedRoom) {
      toast({
        title: "Seleção necessária",
        description: "Selecione uma sala para continuar.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione data e horário.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const totalPrice = calculatePrice();
    
    toast({
      title: "Pagamento confirmado!",
      description: `Sala reservada para ${format(selectedDate!, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}. Valor: R$ ${totalPrice.toFixed(2)}`,
    });
    
    // Reset form
    setCurrentStep(1);
    setSelectedDate(undefined);
    setSelectedRoom('');
    setSelectedTime('');
    setDuration('1');
    setRecurrence('');
    setPaymentProcessing(false);
  };

  const steps = [
    { number: 1, title: 'Selecionar Sala', icon: MapPin },
    { number: 2, title: 'Data e Horário', icon: CalendarIcon },
    { number: 3, title: 'Recorrência', icon: Repeat },
    { number: 4, title: 'Pagamento', icon: CreditCard },
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Agendar Sala</h1>
              <Badge variant="outline">{currentStep}/{steps.length}</Badge>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center space-y-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    currentStep >= step.number 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-muted-foreground text-muted-foreground"
                  )}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-center">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 min-h-[500px]">
          {/* Step 1: Selecionar Sala */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Escolha uma Sala</h2>
                <p className="text-muted-foreground">Selecione a sala que melhor atende suas necessidades</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {orgRooms.map((room) => (
                  <Card 
                    key={room.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2",
                      selectedRoom === room.id 
                        ? "border-primary bg-primary/5" 
                        : "border-muted"
                    )}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{room.name}</h3>
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

                        <p className="text-sm text-muted-foreground">{room.description}</p>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Capacidade: {room.capacity} pessoas</span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Recursos:</p>
                          <div className="flex flex-wrap gap-2">
                            {room.resources?.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <div className="flex items-center gap-1">
                                  {getResourceIcon(resource)}
                                  {resource}
                                </div>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-medium">Preço por hora:</span>
                          <span className="text-lg font-bold text-primary">
                            R$ {room.pricePerHour.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Data e Horário */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Data e Horário</h2>
                <p className="text-muted-foreground">Escolha quando você quer usar a sala</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Selecionar Data
                  </h3>
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

                {/* Time Slots */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horários Disponíveis
                  </h3>

                  {selectedDate ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
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

                      {selectedTime && (
                        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium">Duração da Aula</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {['1', '2', '3', '4'].map((hours) => (
                              <Button
                                key={hours}
                                variant={duration === hours ? "default" : "outline"}
                                onClick={() => setDuration(hours)}
                                className="h-12"
                              >
                                {hours}h
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Selecione uma data primeiro</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Recorrência */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Recorrência</h2>
                <p className="text-muted-foreground">Esta aula se repetirá?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { value: '', label: 'Apenas uma vez', icon: CalendarIcon },
                  { value: 'daily', label: 'Diariamente', icon: Clock },
                  { value: 'weekly', label: 'Semanalmente', icon: Repeat },
                  { value: 'monthly', label: 'Mensalmente', icon: CalendarIcon }
                ].map((option) => (
                  <Card 
                    key={option.value}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2 text-center",
                      recurrence === option.value 
                        ? "border-primary bg-primary/5" 
                        : "border-muted"
                    )}
                    onClick={() => setRecurrence(option.value)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">{option.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {recurrence && (
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ✨ Esta configuração criará múltiplas reservas automaticamente
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Pagamento */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Confirmar Pagamento</h2>
                <p className="text-muted-foreground">Revise os detalhes e finalize sua reserva</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Resumo da Reserva */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo da Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sala:</span>
                        <span className="font-medium">{selectedRoomData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">
                          {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horário:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duração:</span>
                        <span className="font-medium">{duration}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recorrência:</span>
                        <span className="font-medium">
                          {recurrence === '' ? 'Apenas uma vez' :
                           recurrence === 'daily' ? 'Diariamente' :
                           recurrence === 'weekly' ? 'Semanalmente' : 'Mensalmente'}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary">R$ {calculatePrice().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamento via Pague Seguro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                      <div className="text-green-600 dark:text-green-400 mb-2">
                        <CreditCard className="h-8 w-8 mx-auto" />
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Pagamento seguro e criptografado
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        • Cartão de crédito ou débito
                      </p>
                      <p className="text-muted-foreground">
                        • PIX instantâneo
                      </p>
                      <p className="text-muted-foreground">
                        • Boleto bancário
                      </p>
                    </div>

                    <Button 
                      onClick={handlePayment}
                      disabled={paymentProcessing}
                      className="w-full h-12"
                    >
                      {paymentProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagar R$ {calculatePrice().toFixed(2)}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {currentStep < 4 && (
          <Button onClick={nextStep}>
            Próximo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};