import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Code, ChartLine, Paintbrush, Briefcase, Megaphone, Cog, Languages, Lightbulb } from "lucide-react";

const CategoriesSection = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Map of icon names to components
  const iconMap: Record<string, JSX.Element> = {
    'code': <Code className="text-xl" />,
    'chart-line': <ChartLine className="text-xl" />,
    'paint-brush': <Paintbrush className="text-xl" />,
    'briefcase': <Briefcase className="text-xl" />,
    'bullhorn': <Megaphone className="text-xl" />,
    'cogs': <Cog className="text-xl" />,
    'language': <Languages className="text-xl" />,
    'lightbulb': <Lightbulb className="text-xl" />
  };

  // Color classes based on category name
  const getColorClass = (name: string): string => {
    const colorMap: Record<string, string> = {
      'Programming': 'bg-primary/10 text-primary',
      'Data Science': 'bg-indigo-500/10 text-indigo-500',
      'Design': 'bg-orange-500/10 text-orange-500',
      'Business': 'bg-primary/10 text-primary',
      'Marketing': 'bg-indigo-500/10 text-indigo-500',
      'IT & Software': 'bg-orange-500/10 text-orange-500',
      'Languages': 'bg-primary/10 text-primary',
      'Personal Development': 'bg-indigo-500/10 text-indigo-500'
    };
    
    return colorMap[name] || 'bg-primary/10 text-primary';
  };

  return (
    <div id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            Browse by Category
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Discover specialized courses in your area of interest
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-6 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto mt-4" />
                <Skeleton className="h-4 w-20 mx-auto mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {categories?.map((category: Category) => (
              <div 
                key={category.id} 
                className="bg-slate-50 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md hover:bg-slate-100"
              >
                <div className={`h-12 w-12 rounded-full ${getColorClass(category.name)} mx-auto flex items-center justify-center`}>
                  {iconMap[category.icon] || <Code className="text-xl" />}
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">{category.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.courseCount} courses</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesSection;
