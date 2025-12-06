
// src/components/ui/AnimatedCard.tsx
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnimatedCardProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const AnimatedCard = ({ className, onClick, children }: AnimatedCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
