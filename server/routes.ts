import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertContactSubmissionSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
