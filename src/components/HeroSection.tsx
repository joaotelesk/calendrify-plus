import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Star } from "lucide-react";
import { useState } from "react";

export const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-hero animate-pulse opacity-10" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-primary-glow rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-primary/50 rounded-full animate-bounce delay-1000" />
        <Star className="absolute top-1/3 right-1/4 h-6 w-6 text-primary/30 animate-spin" style={{ animationDuration: '8s' }} />
        <Zap className="absolute bottom-1/3 left-1/4 h-4 w-4 text-primary-glow/40 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        {/* Badge with animation */}
        <Badge 
          variant="secondary" 
          className="mb-6 bg-gradient-secondary border-primary/20 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Novo & Moderno
        </Badge>

        {/* Main heading with gradient text */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-pulse">
          Calendrify Pro
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Uma experiência revolucionária de calendário com modo dark elegante e interatividade moderna
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-primary hover:shadow-glow transition-all duration-500 hover:scale-105 px-8 py-6 text-lg group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Começar Agora
            <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 px-8 py-6 text-lg"
          >
            Ver Demo
          </Button>
        </div>

        {/* Stats or features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { label: "Usuários Ativos", value: "10K+" },
            { label: "Eventos Criados", value: "50K+" },
            { label: "Satisfação", value: "99%" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L14.5 8.5L23 11L14.5 13.5L12 22L9.5 13.5L1 11L9.5 8.5L12 0Z" />
  </svg>
);