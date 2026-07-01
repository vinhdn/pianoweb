import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-[#1a3a5c] text-white",
    secondary: "bg-[#c9a84c] text-white",
    outline: "border border-[#1a3a5c] text-[#1a3a5c]",
    destructive: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
