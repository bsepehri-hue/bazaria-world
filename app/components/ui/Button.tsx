import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// Defines the component's available button styles
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  href?: string; // Optional for Link buttons
  children: React.ReactNode;
}

const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition duration-200 ease-in-out whitespace-nowrap active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-center";

const sizeClasses = "px-4 py-2 text-sm";
const loadingIcon = <Loader2 className="w-4 h-4 mr-2 animate-spin" />;

const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'brand': // Dark Emerald background for strong contrast buttons
        return "text-white bg-[#024c05] hover:bg-emerald-900 shadow-md";
    case 'primary': // Teal for main calls-to-action
      return "text-white bg-teal-600 hover:bg-teal-700 shadow-md";
    case 'secondary': // Light background for supporting actions
      return "text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 shadow-sm";
    case 'danger': // Red for destructive actions
      return "text-white bg-red-600 hover:bg-red-700 shadow-md";
    case 'ghost': // Minimal style, often for sidebar or text actions
      return "text-gray-600 hover:bg-gray-100 hover:text-gray-800 shadow-none";
    default:
      return "text-white bg-teal-600 hover:bg-teal-700 shadow-md";
  }
};

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading = false, 
  href, 
  children, 
  disabled, 
  className = '', 
  ...props 
}) => {
  const finalClasses = `${baseClasses} ${sizeClasses} ${getVariantClasses(variant)} ${className}`;
  const isDisabled = disabled || isLoading;

  const content = (
    <>
      {isLoading && loadingIcon}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={finalClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={finalClasses} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
};
