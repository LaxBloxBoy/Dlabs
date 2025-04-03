import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown, User, LogIn, LogOut } from "lucide-react";
import { Category } from "@shared/schema";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [location] = useLocation();
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
              <Link href="/" className="text-primary font-serif font-bold text-2xl">
                D-Code Labs
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/") 
                    ? "border-primary text-primary" 
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
                        ${isActive("/courses") ? "border-primary text-primary" : ""}
                        px-0 font-medium bg-transparent hover:bg-transparent focus:bg-transparent`}
                    >
                      Courses
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="mega-menu-container">
                      <div className="grid w-[600px] grid-cols-2 gap-4 p-6">
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Courses</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link href="/courses/1" className="text-slate-600 hover:text-primary">
                                Web Development Bootcamp
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses/2" className="text-slate-600 hover:text-primary">
                                Data Science Fundamentals
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses/3" className="text-slate-600 hover:text-primary">
                                UX/UI Design Essentials
                              </Link>
                            </li>
                            <li>
                              <Link href="/courses" className="text-primary font-medium hover:underline">
                                View All Courses →
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-3">Categories</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {(categories || []).slice(0, 4).map((category: Category) => (
                              <Link 
                                key={category.id} 
                                href={`/category/${category.id}`}
                                className="text-slate-600 hover:text-primary"
                              >
                                {category.name}
                              </Link>
                            ))}
                            <Link href="/#categories" className="text-primary font-medium hover:underline">
                              View All Categories →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link 
                href="/courses" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/courses") 
                    ? "border-primary text-primary" 
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
                }`}
              >
                All Courses
              </Link>
              
              <Link 
                href="/#about" 
                className="border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onClick={(e) => {
                  if (location === "/") {
                    e.preventDefault();
                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? "" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/") 
                ? "bg-slate-50 border-primary text-primary" 
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
                ? "bg-slate-50 border-primary text-primary" 
                : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
            }`}
            onClick={closeMenu}
          >
            Courses
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
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center"
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
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                <Button variant="default" className="w-full flex items-center justify-center">
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
