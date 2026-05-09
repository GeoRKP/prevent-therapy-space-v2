"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-200",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        "hover:border-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

