import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import Login from "./Login";
import Signup from "./Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [, params] = useRoute("/auth/:tab");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Determine which tab to show based on the URL
  useEffect(() => {
    if (params && params.tab === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [params]);

  // Switch between login and signup tabs
  const handleTabChange = (tab: "login" | "signup") => {
    setLocation(`/auth/${tab === "login" ? "" : tab}`);
    setIsLogin(tab === "login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Auth form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="max-w-md w-full">
          {/* Tabs */}
          <div className="flex mb-8">
            <button
              className={`flex-1 py-3 font-medium border-b-2 ${
                isLogin
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 font-medium border-b-2 ${
                !isLogin
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleTabChange("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {isLogin ? <Login /> : <Signup />}
        </div>
      </div>

      {/* Right side: Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 to-primary/70 flex-col justify-center items-center p-8 text-white">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6">Welcome to D-Code Labs</h1>
          <p className="text-xl mb-8">
            Join our community of learners and accelerate your skills with our expert-led courses in programming, design, and technology.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg
                className="w-6 h-6 mr-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Access to 200+ premium courses</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 mr-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Learn from industry experts</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 mr-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Earn certificates and boost your career</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;