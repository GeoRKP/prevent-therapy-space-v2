"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
      "hover:shadow-md",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Modern glass card variant
const GlassCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg transition-all duration-300",
      "hover:shadow-xl hover:bg-white/90",
      className
    )}
    {...props}
  />
));
GlassCard.displayName = "GlassCard";

// Elevated card with more shadow
const ElevatedCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-card text-card-foreground shadow-lg transition-all duration-300",
      "hover:shadow-xl hover:-translate-y-1",
      className
    )}
    {...props}
  />
));
ElevatedCard.displayName = "ElevatedCard";

// Interactive card with hover effects
const InteractiveCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 cursor-pointer",
      "hover:shadow-lg hover:-translate-y-1 hover:border-primary/30",
      "active:translate-y-0 active:shadow-md",
      className
    )}
    {...props}
  />
));
InteractiveCard.displayName = "InteractiveCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  GlassCard,
  ElevatedCard,
  InteractiveCard,
};

