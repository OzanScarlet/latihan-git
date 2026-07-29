import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
  ghost: "text-slate-700 hover:bg-slate-100",
  destructive: "bg-red-600 text-white hover:bg-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
