import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

// Tailwind CSS Variants con `class-variance-authority`
const buttonVariants = cva(
  "inline-flex flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline: "bg-transparent border border-slate-200 hover:bg-slate-100",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100",
      },
      size: {
        sm: "h-9 px-2 rounded-md",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Componente Button reutilizable
export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant,
  size,
  isLoading,
  startIcon: StartIcon,
  endIcon: EndIcon,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {isLoading && <Spinner size="small" className="mr-2" />}
      {StartIcon && !isLoading && <StartIcon className="mr-2 h-8 w-8 flex-shrink-0 "/>} 
      {children}
      {EndIcon && !isLoading && <EndIcon className="ml-2 h-8 w-8 flex-shrink-0" />} 
    </button>
  );
};
