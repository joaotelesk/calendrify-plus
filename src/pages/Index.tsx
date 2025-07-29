import { HeroSection } from "@/components/HeroSection";
import { InteractiveCard } from "@/components/InteractiveCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Calendar, Users, Zap, Settings, Bell, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Recursos Incríveis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra todas as funcionalidades que tornam o Calendrify Pro único
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InteractiveCard
              title="Calendário Inteligente"
              description="Organize seus eventos com inteligência artificial e sugestões automáticas"
              icon={<Calendar className="h-6 w-6 text-primary" />}
              gradient
            />
            <InteractiveCard
              title="Colaboração em Equipe"
              description="Compartilhe calendários e colabore em tempo real com sua equipe"
              icon={<Users className="h-6 w-6 text-primary" />}
            />
            <InteractiveCard
              title="Notificações Smart"
              description="Receba lembretes personalizados e nunca perca compromissos importantes"
              icon={<Bell className="h-6 w-6 text-primary" />}
              gradient
            />
            <InteractiveCard
              title="Performance Rápida"
              description="Interface otimizada para velocidade e responsividade em todos os dispositivos"
              icon={<Zap className="h-6 w-6 text-primary" />}
            />
            <InteractiveCard
              title="Personalização Total"
              description="Customize cores, temas e layouts para criar sua experiência perfeita"
              icon={<Settings className="h-6 w-6 text-primary" />}
              gradient
            />
            <InteractiveCard
              title="Sincronização Real-time"
              description="Mantenha todos os seus dispositivos sincronizados automaticamente"
              icon={<Clock className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para revolucionar sua produtividade?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de usuários que já transformaram sua rotina
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105">
              Começar Gratuitamente
            </button>
            <button className="border border-primary/20 text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-all duration-300">
              Saber Mais
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
