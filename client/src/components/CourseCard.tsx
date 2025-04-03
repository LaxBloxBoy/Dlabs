import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, BarChart2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { data: instructor, isLoading: isInstructorLoading } = useQuery({
    queryKey: [`/api/instructors/${course.instructorId}`],
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 transition-all duration-200 hover:shadow-md h-full flex flex-col">
      <div className="relative">
        <img className="h-48 w-full object-cover" src={course.image} alt={course.title} />
        {course.isPopular && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Popular
            </Badge>
          </div>
        )}
        {course.isNew && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="secondary" className="bg-indigo-600 text-white">
              New
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6 flex-grow">
        <div className="flex items-center text-sm text-slate-500 mb-1">
          <BarChart2 className="mr-1 h-4 w-4" />
          <span>{course.difficulty}</span>
          <span className="mx-1">•</span>
          <Clock className="mr-1 h-4 w-4" />
          <span>{course.duration}</span>
        </div>
        <Link href={`/courses/${course.id}`}>
          <CardTitle className="text-lg font-semibold text-slate-900 hover:text-primary cursor-pointer">
            {course.title}
          </CardTitle>
        </Link>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{course.description}</p>
        <div className="mt-4 flex items-center">
          {isInstructorLoading ? (
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24 ml-2" />
            </div>
          ) : (
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={instructor?.avatar} alt={instructor?.name} />
                <AvatarFallback>{instructor ? getInitials(instructor.name) : "IN"}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm text-slate-700">{instructor?.name}</span>
            </div>
          )}
          <div className="ml-auto flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-slate-700">{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-5 border-t border-slate-200 flex justify-between items-center p-6">
        <div className="text-slate-900 font-bold">${course.price}</div>
        <Link href="/#waitlist">
          <Button size="sm" className="bg-primary hover:bg-primary/90">Join Waitlist</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
