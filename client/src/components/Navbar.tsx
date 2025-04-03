import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary font-serif font-bold text-2xl">
                LearnHub
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
              <Link 
                href="/#courses" 
                className="border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onClick={(e) => {
                  if (location === "/") {
                    e.preventDefault();
                    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Courses
              </Link>
              <Link 
                href="/#categories" 
                className="border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                onClick={(e) => {
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button 
              variant="default" 
              className="ml-4"
              onClick={() => {
                if (location === "/") {
                  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#waitlist";
                }
              }}
            >
              Sign Up
            </Button>
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
            href="/#courses" 
            className="border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={(e) => {
              closeMenu();
              if (location === "/") {
                e.preventDefault();
                document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Courses
          </Link>
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
          <div className="mt-4 px-4">
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => {
                closeMenu();
                if (location === "/") {
                  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#waitlist";
                }
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
