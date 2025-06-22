import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark" | "gold";
  showText?: boolean;
}

export function Logo({
  className,
  size = "md",
  variant = "light",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  const colorClasses = {
    light: "text-primary",
    dark: "text-primary-foreground",
    gold: "text-yellow-600",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* LV Logo Mark */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 font-serif font-bold",
          sizeClasses[size],
          variant === "light" &&
            "border-primary bg-gradient-to-br from-primary to-accent text-primary-foreground",
          variant === "dark" &&
            "border-primary-foreground bg-gradient-to-br from-primary-foreground to-secondary text-primary",
          variant === "gold" &&
            "border-yellow-600 bg-gradient-to-br from-yellow-600 to-yellow-500 text-white",
        )}
      >
        <span
          className={cn(
            "tracking-tight",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-lg",
            size === "xl" && "text-2xl",
          )}
        >
          LV
        </span>
        {/* Subtle shadow overlay */}
        <div className="absolute inset-0 rounded-lg bg-black/10" />
      </div>

      {/* Company Name */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-serif font-semibold leading-none tracking-tight",
              textSizeClasses[size],
              colorClasses[variant],
            )}
          >
            LV Capital Partners
          </span>
          <span
            className={cn(
              "font-sans text-muted-foreground leading-none tracking-wide",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              size === "xl" && "text-lg",
            )}
          >
            Private Real Estate Investment
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoMark({
  className,
  size = "md",
  variant = "light",
}: Omit<LogoProps, "showText">) {
  return (
    <Logo
      className={className}
      size={size}
      variant={variant}
      showText={false}
    />
  );
}
