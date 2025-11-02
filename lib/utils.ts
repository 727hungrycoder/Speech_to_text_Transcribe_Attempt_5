// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and intelligently merges Tailwind CSS classes using twMerge.
 *
 * @param inputs - An array of class names, conditional class objects, or other values.
 * @returns A single string of merged, unique, and optimized class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}