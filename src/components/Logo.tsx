// Logo.tsx
import React from 'react';
import logo from './logo.avif';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src={logo}
      alt="Vcniti Logo"
      className={`h-12 w-auto ${className}`}
    />
  );
};

export default Logo;
