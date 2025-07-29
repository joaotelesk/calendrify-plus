import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: boolean;
}

export const InteractiveCard = ({ title, description, icon, gradient = false }: InteractiveCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`
        group relative overflow-hidden border-border/50 backdrop-blur-sm transition-all duration-500 hover:shadow-card hover:scale-105 cursor-pointer
        ${gradient ? 'bg-gradient-card hover:shadow-glow' : 'bg-card/80 hover:bg-card'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {description}
        </CardDescription>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        >
          Explorar
          <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </Button>
      </CardContent>
      
      {/* Animated background sparkles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
        <Sparkles className="absolute top-4 right-4 h-6 w-6 text-primary animate-pulse" />
        <Sparkles className="absolute bottom-6 left-6 h-4 w-4 text-primary-glow animate-pulse delay-300" />
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
    </Card>
  );
};