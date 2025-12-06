
// src/components/ui/AnimatedCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnimatedCardProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const AnimatedCard = ({ className, onClick, children }: AnimatedCardProps) => {
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
