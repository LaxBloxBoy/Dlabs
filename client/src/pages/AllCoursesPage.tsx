import { useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Course, Category } from "@shared/schema";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

const AllCoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch all categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch all courses
  const { data: courses, isLoading: isCoursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Filter courses based on active filters
  const filteredCourses = courses && Array.isArray(courses) ? 
    courses.filter((course: Course) => {
      // Filter by category if active
      if (activeCategory && course.categoryId !== activeCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (course.price < priceRange[0] || course.price > priceRange[1]) {
        return false;
      }
      
      // Filter by difficulty
      if (difficulty && course.difficulty !== difficulty) {
        return false;
      }
      
      return true;
    }) : [];

  // Sort the filtered courses
  const sortedCourses = [...filteredCourses].sort((a: Course, b: Course) => {
    switch (sortBy) {
      case "popular":
        // Sort by popularity (is_popular flag, then rating)
        if (a.isPopular === b.isPopular) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return a.isPopular ? -1 : 1;
      case "newest":
        // Sort by newest (is_new flag)
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case "rating":
        // Sort by rating (highest first)
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        // Sort by price (lowest first)
        return a.price - b.price;
      case "price-high":
        // Sort by price (highest first)
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleCategoryClick = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setDifficulty(null);
    setSortBy("popular");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900">All Courses</h1>
          <p className="mt-2 text-lg text-slate-600">
            Browse our complete catalog of professional courses
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters for mobile view */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={toggleFilters}
            >
              <span className="flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters & Sort
              </span>
              <Badge variant="secondary" className="ml-2">
                {(activeCategory ? 1 : 0) + 
                 (searchQuery ? 1 : 0) + 
                 (difficulty ? 1 : 0) + 
                 (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
              </Badge>
            </Button>
            
            {showFilters && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  {/* Search */}
                  <div className="mb-4">
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Sort options */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Sort By</p>
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Category filter */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Category</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={activeCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryClick(null)}
                      >
                        All
                      </Button>
                      {!isCategoriesLoading && categories && Array.isArray(categories) &&
                        categories.map((category: Category): ReactNode => (
                          <Button
                            key={category.id}
                            variant={
                              activeCategory === category.id ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handleCategoryClick(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Difficulty filter */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Difficulty</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={difficulty === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty(null)}
                      >
                        All
                      </Button>
                      <Button
                        variant={difficulty === "Beginner" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty("Beginner")}
                      >
                        Beginner
                      </Button>
                      <Button
                        variant={difficulty === "Intermediate" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty("Intermediate")}
                      >
                        Intermediate
                      </Button>
                      <Button
                        variant={difficulty === "Advanced" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDifficulty("Advanced")}
                      >
                        Advanced
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Price range filter */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">Price Range</p>
                      <p className="text-sm text-slate-500">
                        ${priceRange[0]} - ${priceRange[1]}
                      </p>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000}
                      step={50}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-4"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Sort dropdown for mobile */}
            <div className="mt-4">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Sidebar filters for desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <p className="text-sm font-medium mb-2">Search</p>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Category filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={activeCategory === null ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => handleCategoryClick(null)}
                    >
                      All Categories
                    </Button>
                    {!isCategoriesLoading && categories && Array.isArray(categories) &&
                      categories.map((category: Category): ReactNode => (
                        <Button
                          key={category.id}
                          variant={
                            activeCategory === category.id ? "default" : "ghost"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Difficulty filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Difficulty</p>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={difficulty === null ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setDifficulty(null)}
                    >
                      All Levels
                    </Button>
                    <Button
                      variant={difficulty === "Beginner" ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setDifficulty("Beginner")}
                    >
                      Beginner
                    </Button>
                    <Button
                      variant={difficulty === "Intermediate" ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setDifficulty("Intermediate")}
                    >
                      Intermediate
                    </Button>
                    <Button
                      variant={difficulty === "Advanced" ? "default" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setDifficulty("Advanced")}
                    >
                      Advanced
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Price range filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">Price Range</p>
                    <p className="text-sm text-slate-500">
                      ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Sort options for desktop */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-slate-600">
                Showing {sortedCourses.length} courses
              </p>
              <div className="flex items-center">
                <span className="mr-2 text-slate-700">Sort by:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Course grid */}
            {isCoursesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
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
            ) : sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course: Course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-xl font-medium text-slate-900 mb-2">No courses found</h3>
                  <p className="text-slate-600 text-center mb-6">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AllCoursesPage;