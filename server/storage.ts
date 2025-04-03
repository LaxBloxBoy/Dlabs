import session from "express-session";
import { eq, and } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import { db, pool } from "./db";

import {
  users,
  type User,
  type InsertUser,
  categories,
  type Category,
  type InsertCategory,
  instructors,
  type Instructor,
  type InsertInstructor,
  courses,
  type Course,
  type InsertCourse,
  waitlist,
  type Waitlist,
  type InsertWaitlist,
  contactSubmissions,
  type ContactSubmission,
  type InsertContactSubmission,
  testimonials,
  type Testimonial,
  type InsertTestimonial,
  enrollments,
  type Enrollment,
  type InsertEnrollment
} from "@shared/schema";

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, subscriptionTier: string, hasUnlimitedAccess: boolean): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Instructor methods
  getAllInstructors(): Promise<Instructor[]>;
  getInstructorById(id: number): Promise<Instructor | undefined>;
  createInstructor(instructor: InsertInstructor): Promise<Instructor>;

  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCoursesByCategory(categoryId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Enrollment methods
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(enrollmentId: number, progress: number): Promise<Enrollment>;
  isUserEnrolledInCourse(userId: number, courseId: number): Promise<boolean>;

  // Waitlist methods
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;

  // Contact submissions methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Testimonials methods
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

const PgStore = connectPgSimple(session);

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PgStore({
      conObject: {
        connectionString: process.env.DATABASE_URL!,
      },
      createTableIfMissing: true,
    });
    
    // Initialize the database with sample data
    this.initDatabase();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  async updateUserSubscription(userId: number, subscriptionTier: string, hasUnlimitedAccess: boolean): Promise<User> {
    const result = await db
      .update(users)
      .set({ subscriptionTier, hasUnlimitedAccess })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Instructor methods
  async getAllInstructors(): Promise<Instructor[]> {
    return await db.select().from(instructors);
  }

  async getInstructorById(id: number): Promise<Instructor | undefined> {
    const result = await db.select().from(instructors).where(eq(instructors.id, id)).limit(1);
    return result[0];
  }

  async createInstructor(instructor: InsertInstructor): Promise<Instructor> {
    const result = await db.insert(instructors).values(instructor).returning();
    return result[0];
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.categoryId, categoryId));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(course).returning();
    return result[0];
  }

  // Enrollment methods
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
  }

  async enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment> {
    const result = await db.insert(enrollments).values(enrollment).returning();
    return result[0];
  }

  async updateEnrollmentProgress(enrollmentId: number, progress: number): Promise<Enrollment> {
    const result = await db
      .update(enrollments)
      .set({ progress })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return result[0];
  }

  async isUserEnrolledInCourse(userId: number, courseId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ))
      .limit(1);
    return result.length > 0;
  }

  // Waitlist methods
  async addToWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const result = await db.insert(waitlist).values(entry).returning();
    return result[0];
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return await db.select().from(waitlist);
  }

  // Contact submissions methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  // Initialize database with sample data
  private async initDatabase() {
    try {
      // Check if we already have data in the database
      const existingCategories = await this.getAllCategories();
      if (existingCategories.length > 0) {
        console.log("Database already has data, skipping initialization");
        return;
      }

      console.log("Initializing database with sample data...");

      // Sample categories
      const categoriesData: InsertCategory[] = [
        { name: "Programming", icon: "code", courseCount: 24 },
        { name: "Data Science", icon: "chart-line", courseCount: 18 },
        { name: "Design", icon: "paint-brush", courseCount: 15 },
        { name: "Business", icon: "briefcase", courseCount: 12 },
        { name: "Marketing", icon: "bullhorn", courseCount: 10 },
        { name: "IT & Software", icon: "cogs", courseCount: 22 },
        { name: "Languages", icon: "language", courseCount: 8 },
        { name: "Personal Development", icon: "lightbulb", courseCount: 14 },
        { name: "ISO Standards", icon: "shield-check", courseCount: 22 }
      ];

      for (const category of categoriesData) {
        await this.createCategory(category);
      }

      // Sample instructors
      const instructorsData: InsertInstructor[] = [
        {
          name: "John Smith",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Senior Web Developer with 10+ years of experience"
        },
        {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Data Scientist and Machine Learning Engineer"
        },
        {
          name: "Michael Chen",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "UX/UI Designer with experience at top tech companies"
        },
        {
          name: "Dr. Amanda Miller",
          avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "ISO Standards Expert with 15+ years of consulting experience in Quality Management Systems"
        }
      ];

      for (const instructor of instructorsData) {
        await this.createInstructor(instructor);
      }

      // Sample courses
      const coursesData: InsertCourse[] = [
        {
          title: "Web Development Bootcamp",
          description: "Learn modern web development with JavaScript, React, and Node.js in this comprehensive bootcamp.",
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 499,
          difficulty: "Intermediate",
          duration: "8 weeks",
          categoryId: 1, // Programming
          instructorId: 1, // John Smith
          isPopular: true,
          isNew: false,
          rating: 4.9
        },
        {
          title: "Data Science Fundamentals",
          description: "Master the core concepts of data analysis, Python programming, and machine learning algorithms.",
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 399,
          difficulty: "Beginner",
          duration: "6 weeks",
          categoryId: 2, // Data Science
          instructorId: 2, // Sarah Johnson
          isPopular: false,
          isNew: true,
          rating: 4.7
        },
        {
          title: "UX/UI Design Masterclass",
          description: "Learn the principles of user experience and interface design to create beautiful, functional web applications.",
          image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 549,
          difficulty: "All Levels",
          duration: "10 weeks",
          categoryId: 3, // Design
          instructorId: 3, // Michael Chen
          isPopular: false,
          isNew: false,
          rating: 4.8
        },
        {
          title: "JavaScript for Beginners",
          description: "Start your programming journey with JavaScript, the language of the web.",
          image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 299,
          difficulty: "Beginner",
          duration: "4 weeks",
          categoryId: 1, // Programming
          instructorId: 1, // John Smith
          isPopular: true,
          isNew: false,
          rating: 4.6
        },
        {
          title: "Advanced React & Redux",
          description: "Take your React skills to the next level with advanced patterns and Redux state management.",
          image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 449,
          difficulty: "Advanced",
          duration: "6 weeks",
          categoryId: 1, // Programming
          instructorId: 1, // John Smith
          isPopular: false,
          isNew: true,
          rating: 4.9
        },
        {
          title: "Python for Data Analysis",
          description: "Learn how to use Python for data manipulation, visualization, and analysis.",
          image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 349,
          difficulty: "Intermediate",
          duration: "5 weeks",
          categoryId: 2, // Data Science
          instructorId: 2, // Sarah Johnson
          isPopular: true,
          isNew: false,
          rating: 4.8
        },
        // ISO Quality Management (ISO 9001) Courses
        {
          title: "ISO 9001:2015 - Quality Management Systems (QMS) Basics",
          description: "Learn the fundamentals of ISO 9001:2015 Quality Management Systems and how to implement them in your organization.",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 349,
          difficulty: "Beginner",
          duration: "4 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: true,
          isNew: true,
          rating: 4.8
        },
        {
          title: "Internal Auditor Training for ISO 9001",
          description: "Comprehensive training for conducting internal audits of Quality Management Systems based on ISO 9001:2015.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 399,
          difficulty: "Intermediate",
          duration: "3 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: false,
          isNew: false,
          rating: 4.7
        },
        {
          title: "Implementing ISO 9001 in Your Organization",
          description: "Step-by-step guidance on implementing ISO 9001:2015 quality management principles in your business operations.",
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 499,
          difficulty: "Advanced",
          duration: "6 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: false,
          isNew: false,
          rating: 4.9
        },
        {
          title: "ISO 9001 for Real Estate and Construction Firms",
          description: "Specialized course on applying ISO 9001 quality management standards in real estate and construction industries.",
          image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 449,
          difficulty: "Intermediate",
          duration: "4 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: true,
          isNew: false,
          rating: 4.6
        },
        // Environmental Management (ISO 14001)
        {
          title: "ISO 14001:2015 - Environmental Management Systems (EMS)",
          description: "Master the principles and requirements of ISO 14001:2015 for effective environmental management.",
          image: "https://images.unsplash.com/photo-1483354483454-4cd359948304?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 379,
          difficulty: "Beginner",
          duration: "5 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: false,
          isNew: true,
          rating: 4.8
        },
        {
          title: "Sustainability and ISO 14001 Compliance",
          description: "Learn how to integrate sustainability initiatives with ISO 14001 environmental management standards.",
          image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 399,
          difficulty: "Intermediate",
          duration: "4 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: true,
          isNew: false,
          rating: 4.7
        },
        // Occupational Health & Safety (ISO 45001)
        {
          title: "ISO 45001:2018 - Health and Safety Management Systems",
          description: "Comprehensive guide to implementing occupational health and safety management systems per ISO 45001.",
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89f12e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 429,
          difficulty: "Intermediate",
          duration: "6 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: false,
          isNew: true,
          rating: 4.9
        },
        // Information Security (ISO/IEC 27001)
        {
          title: "ISO 27001:2022 - Information Security Management Systems",
          description: "Learn how to protect your organization's information assets with ISO 27001-compliant security systems.",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 499,
          difficulty: "Advanced",
          duration: "8 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: true,
          isNew: true,
          rating: 4.8
        },
        // Risk Management (ISO 31000)
        {
          title: "ISO 31000:2018 - Principles of Risk Management",
          description: "Master the fundamentals of risk management using the internationally recognized ISO 31000 framework.",
          image: "https://images.unsplash.com/photo-1612099197029-2f6a035fe6f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
          price: 399,
          difficulty: "Intermediate",
          duration: "5 weeks",
          categoryId: 9, // ISO Standards
          instructorId: 4, // Dr. Amanda Miller
          isPopular: false,
          isNew: false,
          rating: 4.7
        }
      ];

      for (const course of coursesData) {
        await this.createCourse(course);
      }

      // Sample testimonials
      const testimonialsData: InsertTestimonial[] = [
        {
          name: "Emily Walker",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5,
          text: "The Web Development Bootcamp was exactly what I needed to transition into tech. Within 3 months of completing the course, I landed my first developer job.",
          program: "Web Development Graduate"
        },
        {
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 4,
          text: "The Data Science course gave me practical skills I use daily. The instructors were knowledgeable and the projects helped build a strong portfolio.",
          program: "Data Science Graduate"
        },
        {
          name: "Jessica Rodriguez",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          rating: 5,
          text: "I took the UX/UI Design Masterclass while working full-time, and the flexible schedule was perfect. I've completely redesigned our product based on what I learned.",
          program: "UX/UI Design Graduate"
        }
      ];

      for (const testimonial of testimonialsData) {
        await this.createTestimonial(testimonial);
      }

      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
}

export const storage = new PostgresStorage();
