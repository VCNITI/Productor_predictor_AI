import { motion } from "framer-motion";

interface AnimatedCardProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const AnimatedCard = ({
  className,
  onClick,
  children,
}: AnimatedCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
      onClick={onClick}
    >
      <div className="shadow-none">{children}</div>
    </motion.div>
  );
};
