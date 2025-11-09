// SECURITY FIX: Safe avatar component to replace innerHTML usage
// Prevents XSS attacks by using React's safe rendering instead of innerHTML
import React from 'react';

interface SafeAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-forest rounded-full ${className}`}>
      <span className={`text-white font-bold ${sizeClasses[size]}`}>TB</span>
    </div>
  );
};

