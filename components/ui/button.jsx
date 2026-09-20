"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border-2 border-primary bg-transparent text-primary shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        // Modern gradient variant
        gradient:
          "bg-gradient-to-r from-primary to-[#5a8fe8] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-primary/90 hover:to-[#5a8fe8]/90",
        // Glass morphism variant
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 hover:-translate-y-0.5",
        // Soft variant with subtle background
        soft:
          "bg-primary/10 text-primary hover:bg-primary/20 hover:-translate-y-0.5",
        // Modern dark variant
        dark:
          "bg-[#343f52] text-white shadow-md hover:bg-[#343f52]/90 hover:shadow-lg hover:-translate-y-0.5",
        // White/Light variant for dark backgrounds
        white:
          "bg-white text-[#343f52] shadow-md hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5",
        // Outline white for dark backgrounds
        "outline-white":
          "border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#343f52] hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

