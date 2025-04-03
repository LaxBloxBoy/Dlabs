import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { ProgressIndicator } from "./ProgressIndicator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  enrollment: {
    id: number;
    progress: number;
    status: string;
    course: {
      id: number;
      title: string;
      image: string;
      difficulty: string;
      instructor: {
        name: string;
        avatar: string;
      };
      category: {
        name: string;
      };
    };
  };
  className?: string;
  onContinue?: (id: number) => void;
}

export function CourseCard({ enrollment, className, onContinue }: CourseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className={cn("bg-white dark:bg-slate-800 overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src={enrollment.course.image} 
                  alt={enrollment.course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Course";
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium line-clamp-1 mb-1">
                {enrollment.course.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>{enrollment.course.instructor.name}</span>
                <span>•</span>
                <span>{enrollment.course.category.name}</span>
              </div>
              <Badge 
                variant="secondary"
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full", 
                  getDifficultyColor(enrollment.course.difficulty)
                )}
              >
                {enrollment.course.difficulty}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <ProgressIndicator 
              progress={enrollment.progress} 
              showPercentage={false}
            />
          </div>

          <div className="flex gap-2">
            {enrollment.status === 'completed' ? (
              <Button className="w-full" variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Review
              </Button>
            ) : (
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => onContinue?.(enrollment.id)}
              >
                <Play className="h-4 w-4 mr-2" />
                {enrollment.progress === 0 ? 'Start' : 'Continue'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}