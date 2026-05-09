import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 * Handles class conflicts intelligently
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

