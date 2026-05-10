import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Optional: Add padding control
  padding?: 'default' | 'none' | 'large';
  // Optional: Add border color for emphasis
  borderColor?: 'teal' | 'red' | 'yellow' | 'default';
  children: React.ReactNode;
}

const paddingMap = {
  default: 'p-6',
  none: 'p-0',
  large: 'p-8',
};

const borderMap = {
  teal: 'border-teal-300',
  red: 'border-red-300',
  yellow: 'border-yellow-300',
  default: 'border-gray-100',
};

export const Card: React.FC<CardProps> = ({ 
  padding = 'default', 
  borderColor = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const finalClasses = `
    bg-white 
    rounded-xl 
    shadow-lg 
    border 
    transition-all 
    duration-300 
    ${paddingMap[padding]} 
    ${borderMap[borderColor]} 
    ${className}
  `;

  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  );
};
