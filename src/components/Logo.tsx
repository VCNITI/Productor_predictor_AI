// Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src="/logo.avif"
      alt="Vcniti Logo"
      className={`h-12 w-auto ${className}`}
    />
  );
};

export default Logo;
