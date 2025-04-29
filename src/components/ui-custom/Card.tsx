
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm border border-border",
        glass: "glass-card",
        elevated: "bg-white shadow-medium border border-gray-100 hover:shadow-strong hover:-translate-y-1",
        outline: "border border-border bg-transparent",
        glassmorphism: "backdrop-blur-md bg-white/75 border border-white/20 shadow-sm",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  href?: string;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, as: Component = "div", href, interactive, ...props }, ref) => {
    const Comp = href ? "a" : Component;
    
    return (
      <Comp
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, className }),
          interactive && "cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1",
          href && "cursor-pointer"
        )}
        href={href}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn("font-semibold text-lg leading-tight tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
