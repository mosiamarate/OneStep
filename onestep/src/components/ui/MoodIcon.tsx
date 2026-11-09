import {
  BatteryLow,
  CircleMinus,
  CloudRain,
  Heart,
  Leaf,
  Smile,
  Sparkles,
  Sprout,
  Wind,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  tired: BatteryLow,
  stressed: CloudRain,
  okay: CircleMinus,
  good: Smile,
  better: Leaf,
  proud: Sprout,
  calm: Wind,
  same: Heart,
};

interface MoodIconProps {
  mood: string;
  size?: number;
  className?: string;
}

export default function MoodIcon({
  mood,
  size = 20,
  className,
}: MoodIconProps) {
  const Icon = icons[mood.toLowerCase()] ?? Sparkles;

  return <Icon aria-hidden="true" size={size} className={className} />;
}
