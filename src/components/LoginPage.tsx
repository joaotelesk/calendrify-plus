import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Calendrify Pro",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email não encontrado",
        variant: "destructive",
      });
    }
  };

  const quickLogins = [
    { email: 'admin@unitech.com', role: 'Administrador', name: 'Admin Silva' },
    { email: 'maria@unitech.com', role: 'Professor', name: 'Prof. Maria Santos' },
    { email: 'joao@unitech.com', role: 'Estudante', name: 'João Estudante' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Calendrify Pro</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Sistema de
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Agendamento
            </span>
            Inteligente
          </h1>
          
          <p className="text-xl text-white/80 max-w-lg">
            Gerencie salas, crie eventos e facilite reservas com pagamento integrado e sincronização automática.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 text-white/90">
              <Users className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Múltiplos usuários</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <Clock className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Tempo real</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <MapPin className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Múltiplas salas</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-glow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Entrar na Plataforma
            </CardTitle>
            <CardDescription className="text-center">
              Use um dos emails abaixo para testar diferentes perfis
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-primary hover:shadow-primary transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar com Google (Mock)'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Contas de teste</span>
              </div>
            </div>

            <div className="space-y-2">
              {quickLogins.map((account, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setEmail(account.email)}
                  disabled={isLoading}
                >
                  <div className="text-left">
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-muted-foreground">{account.role} • {account.email}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};