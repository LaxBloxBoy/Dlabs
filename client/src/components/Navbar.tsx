import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  ChevronDown, User, LogIn, LogOut, Search, Landmark, Award, 
  Code, Database, PenTool, BookOpen, Video, FileText, Building2, 
  Users, MessageSquare, Mail as MailIcon, GraduationCap, 
  BookOpenCheck, GanttChartSquare
} from "lucide-react";
import { Category } from "@shared/schema";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Fetch categories for the mega menu
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mega-menu-container') && isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMegaMenuOpen]);

  // Group categories by row for the mega menu (3 categories per row)
  const groupCategoriesByRow = (categories: Category[] = []) => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 3) {
      rows.push(categories.slice(i, i + 3));
    }
    return rows;
  };

  const categoryRows = groupCategoriesByRow(categories || []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-emerald-600 font-serif font-bold text-2xl">
                D-Code Labs
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
              <Link 
                href="/" 
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                  isActive("/") 
                    ? "border-emerald-600 text-emerald-600" 
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                Home
              </Link>
              
              {/* Navigation menu for courses with mega menu */}
              <NavigationMenu className="z-50">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 
                        ${isActive("/courses") ? "border-emerald-600 text-emerald-600" : ""}
                        px-2 font-medium bg-transparent hover:bg-transparent focus:bg-transparent whitespace-nowrap min-w-[120px]`}
                    >
                      Courses
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="mega-menu-container">
                      <div className="grid w-[600px] grid-cols-2 gap-4 p-6">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Courses</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/courses/1" className="flex items-center text-slate-600 hover:text-emerald-600">
                                <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                  <Code className="h-4 w-4 text-emerald-600" />
                                </div>
                                Web Development Bootcamp
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses/2" className="flex items-center text-slate-600 hover:text-emerald-600">
                                <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                  <Database className="h-4 w-4 text-emerald-600" />
                                </div>
                                Data Science Fundamentals
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses/3" className="flex items-center text-slate-600 hover:text-emerald-600">
                                <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                  <PenTool className="h-4 w-4 text-emerald-600" />
                                </div>
                                UX/UI Design Essentials
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses" className="text-emerald-600 font-medium hover:underline mt-2 inline-block">
                                View All Courses →
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-3">Categories</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(categories || []).slice(0, 4).map((category: Category) => (
                              <Link 
                                key={category.id} 
                                href={`/category/${category.id}`}
                                className="flex items-center text-slate-600 hover:text-emerald-600"
                              >
                                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                                  <div className="h-3 w-3 text-emerald-600">
                                    {category.icon === 'code' ? <Code className="h-3 w-3" /> : 
                                     category.icon === 'database' ? <Database className="h-3 w-3" /> :
                                     category.icon === 'design' ? <PenTool className="h-3 w-3" /> :
                                     <BookOpen className="h-3 w-3" />}
                                  </div>
                                </div>
                                {category.name}
                              </Link>
                            ))}
                            <Link href="/#categories" className="text-emerald-600 font-medium hover:underline col-span-2 mt-2 inline-block">
                              View All Categories →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <NavigationMenu className="z-50">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 
                        px-0 font-medium bg-transparent hover:bg-transparent focus:bg-transparent`}
                    >
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="mega-menu-container">
                      <div className="w-[400px] p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">Learning Resources</h3>
                        <ul className="space-y-3">
                          <li>
                            <Link href="/resources/guides" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <BookOpenCheck className="h-4 w-4 text-emerald-600" />
                              </div>
                              Learning Guides
                            </Link>
                          </li>
                          <li>
                            <Link href="/resources/webinars" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <Video className="h-4 w-4 text-emerald-600" />
                              </div>
                              Free Webinars
                            </Link>
                          </li>
                          <li>
                            <Link href="/resources/blog" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <FileText className="h-4 w-4 text-emerald-600" />
                              </div>
                              Industry Blog
                            </Link>
                          </li>
                          <li>
                            <Link href="/resources/certification" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <Award className="h-4 w-4 text-emerald-600" />
                              </div>
                              Certification Paths
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <Link 
                href="/courses" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/courses") 
                    ? "border-emerald-600 text-emerald-600" 
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                All Courses
              </Link>
              
              <NavigationMenu className="z-50">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 
                        px-0 font-medium bg-transparent hover:bg-transparent focus:bg-transparent`}
                    >
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="mega-menu-container">
                      <div className="w-[400px] p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">About D-Code Labs</h3>
                        <ul className="space-y-3">
                          <li>
                            <Link href="/about/company" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <Building2 className="h-4 w-4 text-emerald-600" />
                              </div>
                              Our Company
                            </Link>
                          </li>
                          <li>
                            <Link href="/about/instructors" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <Users className="h-4 w-4 text-emerald-600" />
                              </div>
                              Meet Our Instructors
                            </Link>
                          </li>
                          <li>
                            <Link href="/about/testimonials" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <MessageSquare className="h-4 w-4 text-emerald-600" />
                              </div>
                              Student Testimonials
                            </Link>
                          </li>
                          <li>
                            <Link href="/contact" className="flex items-center text-slate-600 hover:text-emerald-600">
                              <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center mr-2">
                                <MailIcon className="h-4 w-4 text-emerald-600" />
                              </div>
                              Contact Us
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center">
            {/* Search Bar - separate from profile dropdown */}
            <div className="mr-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-44 md:w-64 pl-9 h-9 rounded-full bg-slate-50 border-slate-200 focus:border-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-emerald-600 hover:text-emerald-700">
                  Search
                </button>
              </form>
            </div>
            
            {/* Auth buttons in separate div */}
            <div className="flex items-center space-x-4">
              {user ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="flex items-center border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" size="sm" className="flex items-center bg-emerald-600 hover:bg-emerald-700">
                      <User className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <GanttChartSquare className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isMenuOpen ? "" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="px-3 py-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-9 rounded-full bg-slate-50 border-slate-200 focus:border-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </form>

          <Link 
            href="/" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/") 
                ? "bg-slate-50 border-emerald-600 text-emerald-600" 
                : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/courses" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/courses") 
                ? "bg-slate-50 border-emerald-600 text-emerald-600" 
                : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
            }`}
            onClick={closeMenu}
          >
            Courses
          </Link>
          
          <Link 
            href="/resources/guides" 
            className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={closeMenu}
          >
            Resources
          </Link>

          {/* Remove duplicate Courses link in mobile menu */}
          <Link 
            href="/#categories" 
            className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={(e) => {
              closeMenu();
              if (location === "/") {
                e.preventDefault();
                document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Categories
          </Link>
          <Link 
            href="/#about" 
            className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={(e) => {
              closeMenu();
              if (location === "/") {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            About
          </Link>
          {user ? (
            <div className="mt-4 px-4 space-y-2">
              <Link href="/profile" onClick={closeMenu}>
                <Button variant="outline" className="w-full flex items-center justify-center border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  closeMenu();
                  logoutMutation.mutate();
                }}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Log Out"}
              </Button>
            </div>
          ) : (
            <div className="mt-4 px-4 space-y-2">
              <Link href="/login" onClick={closeMenu}>
                <Button variant="outline" className="w-full flex items-center justify-center border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                <Button variant="default" className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700">
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;