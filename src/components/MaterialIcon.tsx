import { cn } from "@/lib/utils";

interface MaterialIconProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  color?: "mint" | "coral" | "sky" | "cream";
}

const MaterialIcon = ({ emoji, label, isSelected, onClick, color = "mint" }: MaterialIconProps) => {
  const colorClasses = {
    mint: "bg-mint/20 border-mint",
    coral: "bg-coral/20 border-coral",
    sky: "bg-sky/20 border-sky",
    cream: "bg-cream border-muted"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-6 rounded-3xl border-4 transition-all duration-300",
        "hover:scale-105 active:scale-95",
        isSelected 
          ? `${colorClasses[color]} shadow-lg scale-105 border-opacity-100` 
          : "bg-card/50 border-border/50 border-opacity-0"
      )}
    >
      <span className="text-5xl animate-bounce-soft">{emoji}</span>
      <span className="text-sm font-semibold text-foreground/80">{label}</span>
    </button>
  );
};

export default MaterialIcon;
