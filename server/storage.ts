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
  type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private instructors: Map<number, Instructor>;
  private courses: Map<number, Course>;
  private waitlistEntries: Map<number, Waitlist>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private testimonials: Map<number, Testimonial>;

  private userIdCounter: number;
  private categoryIdCounter: number;
  private instructorIdCounter: number;
  private courseIdCounter: number;
  private waitlistIdCounter: number;
  private contactSubmissionIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.instructors = new Map();
    this.courses = new Map();
    this.waitlistEntries = new Map();
    this.contactSubmissions = new Map();
    this.testimonials = new Map();

    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.instructorIdCounter = 1;
    this.courseIdCounter = 1;
    this.waitlistIdCounter = 1;
    this.contactSubmissionIdCounter = 1;
    this.testimonialIdCounter = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Instructor methods
  async getAllInstructors(): Promise<Instructor[]> {
    return Array.from(this.instructors.values());
  }

  async getInstructorById(id: number): Promise<Instructor | undefined> {
    return this.instructors.get(id);
  }

  async createInstructor(insertInstructor: InsertInstructor): Promise<Instructor> {
    const id = this.instructorIdCounter++;
    const instructor: Instructor = { ...insertInstructor, id };
    this.instructors.set(id, instructor);
    return instructor;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.categoryId === categoryId
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Waitlist methods
  async addToWaitlist(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistIdCounter++;
    const entry: Waitlist = { 
      ...insertWaitlist, 
      id, 
      createdAt: new Date() 
    };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return Array.from(this.waitlistEntries.values());
  }

  // Contact submissions methods
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactSubmissionIdCounter++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Initialize sample data
  private initSampleData() {
    // Sample categories
    const categoriesData: InsertCategory[] = [
      { name: "Programming", icon: "code", courseCount: 24 },
      { name: "Data Science", icon: "chart-line", courseCount: 18 },
      { name: "Design", icon: "paint-brush", courseCount: 15 },
      { name: "Business", icon: "briefcase", courseCount: 12 },
      { name: "Marketing", icon: "bullhorn", courseCount: 10 },
      { name: "IT & Software", icon: "cogs", courseCount: 22 },
      { name: "Languages", icon: "language", courseCount: 8 },
      { name: "Personal Development", icon: "lightbulb", courseCount: 14 }
    ];

    categoriesData.forEach(category => {
      this.createCategory(category);
    });

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
      }
    ];

    instructorsData.forEach(instructor => {
      this.createInstructor(instructor);
    });

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
      }
    ];

    coursesData.forEach(course => {
      this.createCourse(course);
    });

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

    testimonialsData.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();
