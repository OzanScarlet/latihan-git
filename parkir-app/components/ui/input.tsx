import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Select.displayName = "Select";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-slate-700 mb-1", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
