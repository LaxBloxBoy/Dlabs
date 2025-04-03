import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSubmissionSchema, insertEnrollmentSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API Routes prefix
  const apiPrefix = "/api";

  // Categories routes
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get(`${apiPrefix}/categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Courses routes
  app.get(`${apiPrefix}/courses`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let courses;
      if (categoryId) {
        courses = await storage.getCoursesByCategory(categoryId);
      } else {
        courses = await storage.getAllCourses();
      }
      
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get(`${apiPrefix}/courses/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const instructor = await storage.getInstructorById(course.instructorId);
      const category = await storage.getCategoryById(course.categoryId);
      
      res.json({
        ...course,
        instructor,
        category
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course details" });
    }
  });

  // Waitlist routes
  app.post(`${apiPrefix}/waitlist`, async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      const waitlistEntry = await storage.addToWaitlist(validatedData);
      res.status(201).json(waitlistEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to add to waitlist" });
    }
  });

  // Contact form routes
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Testimonials routes
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Instructors routes
  app.get(`${apiPrefix}/instructors`, async (req, res) => {
    try {
      const instructors = await storage.getAllInstructors();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch instructors" });
    }
  });

  app.get(`${apiPrefix}/instructors/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const instructor = await storage.getInstructorById(id);
      
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      
      res.json(instructor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch instructor" });
    }
  });

  // Enrollment routes - all require authentication
  app.get(`${apiPrefix}/enrollments`, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const userId = req.user.id;
      const enrollments = await storage.getUserEnrollments(userId);
      
      // Get course data for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourseById(enrollment.courseId);
          return {
            ...enrollment,
            course
          };
        })
      );
      
      res.json(enrollmentsWithCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post(`${apiPrefix}/enrollments`, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const userId = req.user.id;
      const { courseId } = req.body;
      
      // Check if user is already enrolled
      const isEnrolled = await storage.isUserEnrolledInCourse(userId, courseId);
      if (isEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      // Check if course exists
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user has unlimited access or handle payment
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      if (!user.hasUnlimitedAccess && course.price > 0) {
        // For users without unlimited access, check if they have an appropriate subscription tier
        if (user.subscriptionTier === 'free') {
          return res.status(402).json({ 
            message: "Payment required", 
            details: "You need to purchase this course or upgrade to a premium subscription"
          });
        }
      }
      
      // Enroll the user
      const enrollment = await storage.enrollUserInCourse({
        userId,
        courseId,
        status: "active",
        progress: 0
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });
  
  app.patch(`${apiPrefix}/enrollments/:id/progress`, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const enrollmentId = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
      }
      
      const enrollment = await storage.updateEnrollmentProgress(enrollmentId, progress);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  
  // User subscription routes
  app.patch(`${apiPrefix}/user/subscription`, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = req.user.id;
      const { subscriptionTier, hasUnlimitedAccess } = req.body;
      
      // TODO: In a real app, we would verify payment or subscription status with a payment provider
      
      const updatedUser = await storage.updateUserSubscription(
        userId, 
        subscriptionTier,
        hasUnlimitedAccess
      );
      
      // Remove sensitive fields
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Admin-only route to give unlimited access to a user (for testing)
  app.post(`${apiPrefix}/admin/give-unlimited-access`, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { userId } = req.body;
      
      const updatedUser = await storage.updateUserSubscription(
        userId, 
        "premium",
        true
      );
      
      // Remove sensitive fields
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to give unlimited access" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
