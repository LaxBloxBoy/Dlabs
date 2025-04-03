import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@shared/schema";

const CourseSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [visibleCourses, setVisibleCourses] = useState<number>(6);
  
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: activeCategory ? ['/api/courses', activeCategory] : ['/api/courses'],
  });
  
  // Handle category filter click
  const handleCategoryClick = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };
  
  // Load more courses
  const loadMore = () => {
    setVisibleCourses(prevCount => prevCount + 3);
  };
  
  // Filter courses based on active category
  const filteredCourses = courses ? 
    (activeCategory ? courses.filter((course: Course) => course.categoryId === activeCategory) : courses) : 
    [];
  
  return (
    <div id="courses" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Featured Courses
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Explore our most popular learning paths to kickstart your career
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${activeCategory === null ? 'bg-primary text-white' : 'text-slate-900'}`}
                onClick={() => handleCategoryClick(null)}
              >
                All
              </Button>
              
              {isCategoriesLoading ? (
                <>
                  <Skeleton className="w-28 h-9 rounded-full" />
                  <Skeleton className="w-28 h-9 rounded-full" />
                  <Skeleton className="w-28 h-9 rounded-full" />
                </>
              ) : (
                categories?.slice(0, 3).map((category: any) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${activeCategory === category.id ? 'bg-primary text-white' : 'text-slate-900'}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          {isCoursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.slice(0, visibleCourses).map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-600">No courses found in this category.</p>
            </div>
          )}
        </div>

        {filteredCourses.length > visibleCourses && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="px-6 py-3"
              onClick={loadMore}
            >
              View More Courses
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSection;
