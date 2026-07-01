import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "success" | "warning" | "danger";

const variants: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  accent: "bg-[#c8a96e]/10 text-[#b8935a]",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
