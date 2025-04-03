import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressIndicator } from "./ProgressIndicator";
import { Play, BookOpen } from "lucide-react";
import { Link } from "wouter";

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
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${enrollment.course.image})` }}
          ></div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h3 className="text-base font-medium line-clamp-1">
                {enrollment.course.title}
              </h3>
              <Badge variant="outline" className={getStatusClass(enrollment.status)}>
                {enrollment.status}
              </Badge>
            </div>
            
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="mr-2 text-xs">
                {enrollment.course.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {enrollment.course.category.name}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={enrollment.course.instructor.avatar} />
                <AvatarFallback>
                  {getInitials(enrollment.course.instructor.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {enrollment.course.instructor.name}
              </span>
            </div>
            
            <div className="mt-3">
              <ProgressIndicator progress={enrollment.progress} size="sm" />
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/courses/${enrollment.course.id}`}>
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Details</span>
                </Link>
              </Button>
              
              <Button
                size="sm"
                onClick={() => onContinue?.(enrollment.id)}
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Continue</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}