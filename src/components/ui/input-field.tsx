import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const inputFieldVariants = cva(
  "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        filled: "bg-secondary border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        outlined: "bg-transparent border-input focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        ghost: "bg-transparent border-transparent focus-visible:bg-secondary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base"
      },
      invalid: {
        true: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        false: ""
      }
    },
    defaultVariants: {
      variant: "outlined",
      size: "md",
      invalid: false
    }
  }
);

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputFieldVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  invalid?: boolean;
  showClear?: boolean;
  onClear?: () => void;
  loading?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      variant,
      size,
      invalid,
      label,
      helperText,
      errorMessage,
      showClear,
      onClear,
      loading,
      type = "text",
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const isInvalid = invalid || !!errorMessage;
    const hasValue = value && value.toString().length > 0;

    const inputId = React.useId();

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(labelVariants({ size }), isInvalid && "text-destructive")}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            id={inputId}
            type={actualType}
            value={value}
            disabled={disabled || loading}
            className={cn(
              inputFieldVariants({ variant, size, invalid: isInvalid }),
              (isPassword || showClear || loading) && "pr-10",
              (isPassword && showClear && hasValue) && "pr-16",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"></div>
            </div>
          )}
          
          {/* Clear button */}
          {!loading && showClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded",
                isPassword ? "right-8" : "right-2"
              )}
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </button>
          )}
          
          {/* Password toggle */}
          {!loading && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <p className={cn(
            "text-xs",
            isInvalid ? "text-destructive" : "text-muted-foreground"
          )}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField };