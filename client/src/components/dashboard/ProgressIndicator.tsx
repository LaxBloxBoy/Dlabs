import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export function ProgressIndicator({
  progress,
  size = "md",
  showPercentage = true,
  className,
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div
          className={cn(
            "bg-primary rounded-full transition-all duration-300 ease-in-out",
            sizeClasses[size]
          )}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showPercentage && (
        <p className="text-xs text-right font-medium">{progress}%</p>
      )}
    </div>
  );
}