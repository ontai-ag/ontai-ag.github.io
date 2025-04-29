
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        glass: "bg-white/80 backdrop-blur-md border border-gray-200/50 text-gray-900 hover:bg-white/90 shadow-sm",
      },
      size: {
        xs: "h-8 rounded-md px-3 text-xs",
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, rightIcon, leftIcon, as: Component = 'button', to, type = "button", ...props }, ref) => {
    // Create a combined props object
    const buttonProps: any = { ...props };
    
    // Only add 'to' prop for components that accept it (like Link)
    if (to) buttonProps.to = to;
    
    // Important fix: Set the button type correctly for form submissions
    // Only set the type attribute on actual button elements
    const elementProps: any = {
      className: cn(buttonVariants({ variant, size, fullWidth, className })),
      disabled: loading || props.disabled,
      ...buttonProps,
    };
    
    // Only add type if this is a true button element
    if (Component === 'button') {
      elementProps.type = type; // Ensure type gets passed through
    }
    
    return (
      <Component
        ref={ref}
        {...elementProps}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Component>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };
