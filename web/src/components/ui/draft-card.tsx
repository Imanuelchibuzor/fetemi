"use client";

interface DraftCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  onClick: () => void;
  index: number;
}

export function DraftCard({ id, title, excerpt, image, onClick, index }: DraftCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`group relative flex flex-col bg-secondary/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer hover:-translate-y-2 opacity-0 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-8 flex flex-col gap-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-primary">Draft 0{id}</div>
        <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm font-medium text-foreground/50 leading-relaxed line-clamp-2">{excerpt}</p>
      </div>
    </div>
  );
}
