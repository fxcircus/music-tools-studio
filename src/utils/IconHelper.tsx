import React from 'react';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';

// This helper component properly types the react-icons
export const Icon = ({ icon, size, color, className, style }: { 
  icon: IconType;
  size?: number; 
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  // Create a component that renders the icon
  const IconComponent = icon as React.ComponentType<IconBaseProps>;
  return <IconComponent size={size} color={color} className={className} style={style} />;
}; 