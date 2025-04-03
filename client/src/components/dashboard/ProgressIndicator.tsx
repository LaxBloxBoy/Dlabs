import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressIndicator({ 
  progress,
  showPercentage = true,
  className
}: ProgressIndicatorProps) {
  // Ensure progress is between 0 and 100
  const validProgress = Math.max(0, Math.min(100, progress));
  
  // Determine color based on progress
  const getColorClass = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", getColorClass(validProgress))}
          style={{ width: `${validProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs font-medium">{validProgress}%</span>
      )}
    </div>
  );
}