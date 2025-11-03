import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  subtitle: string;
  overview: string;
  icon: LucideIcon;
  backgroundImage: string;
}

export default function InsightCard({ 
  title, 
  subtitle, 
  overview, 
  icon: Icon,
  backgroundImage 
}: InsightCardProps) {
  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group cursor-pointer">
      {/* Background Image */}
      <img 
        src={backgroundImage} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Icon */}
        <div className="flex justify-start">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              {subtitle}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              OVERVIEW
            </h4>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              {overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
