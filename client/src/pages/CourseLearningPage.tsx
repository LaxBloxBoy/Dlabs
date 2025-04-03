import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Play, CheckCircle, Circle, Info, Download } from "lucide-react";
import { ProtectedRoute } from "@/lib/protected-route";

interface CourseStep {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'download';
  content: string;
  duration?: string;
  isCompleted: boolean;
}

interface CourseSection {
  id: number;
  title: string;
  steps: CourseStep[];
}

interface CourseLearningDetails {
  id: number;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  progress: number;
  enrollmentId: number;
  sections: CourseSection[];
}



function CourseLearningContent() {
  const { courseId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({1: true});
  
  // Fetch course learning content
  const { 
    data: courseLearningDetails,
    isLoading: isLoadingCourseContent,
    error: courseContentError
  } = useQuery<CourseLearningDetails>({
    queryKey: [`/api/courses/${courseId}/learning-content`],
    enabled: !!courseId && !!user
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: number; progress: number }) => {
      const res = await apiRequest("PATCH", `/api/enrollments/${enrollmentId}/progress`, { progress });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Progress updated",
        description: "Your course progress has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mark a step as completed
  const completeStep = (sectionIndex: number, stepIndex: number) => {
    if (!courseLearningDetails) return;
    
    // Update the step's isCompleted status
    const updatedSections = [...courseLearningDetails.sections];
    updatedSections[sectionIndex].steps[stepIndex].isCompleted = true;
    
    // Calculate new overall progress
    const totalSteps = updatedSections.reduce((total, section) => total + section.steps.length, 0);
    const completedSteps = updatedSections.reduce((total, section) => 
      total + section.steps.filter(step => step.isCompleted).length, 0);
    
    const newProgressPercentage = Math.round((completedSteps / totalSteps) * 100);
    
    // Update progress on the server
    updateProgressMutation.mutate({
      enrollmentId: courseLearningDetails.enrollmentId,
      progress: newProgressPercentage
    });
  };
  
  // Toggle section expanded state
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    if (!courseLearningDetails) return;
    
    const currentSection = courseLearningDetails.sections[activeSection];
    
    // If there are more steps in the current section
    if (activeStep < currentSection.steps.length - 1) {
      setActiveStep(activeStep + 1);
      completeStep(activeSection, activeStep);
    } 
    // If there are more sections
    else if (activeSection < courseLearningDetails.sections.length - 1) {
      completeStep(activeSection, activeStep);
      setActiveSection(activeSection + 1);
      setActiveStep(0);
      // Expand the new section
      setExpandedSections(prev => ({
        ...prev,
        [courseLearningDetails.sections[activeSection + 1].id]: true
      }));
    }
  };
  
  // Navigate to previous step
  const goToPreviousStep = () => {
    if (!courseLearningDetails) return;
    
    // If there are previous steps in the current section
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } 
    // If there are previous sections
    else if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      const prevSectionSteps = courseLearningDetails.sections[activeSection - 1].steps;
      setActiveStep(prevSectionSteps.length - 1);
    }
  };
  
  // Set specific step as active
  const setActiveStepById = (sectionIndex: number, stepIndex: number) => {
    setActiveSection(sectionIndex);
    setActiveStep(stepIndex);
  };
  
  // Go back to course detail page
  const goBackToCourse = () => {
    setLocation(`/courses/${courseId}`);
  };
  
  if (isLoadingCourseContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (courseContentError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-400">
            Failed to load course learning content. You may not be enrolled in this course.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setLocation(`/courses/${courseId}`)}
          >
            Go Back to Course
          </Button>
        </div>
      </div>
    );
  }
  
  if (!courseLearningDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Course Unavailable</h2>
          <p className="text-yellow-600 dark:text-yellow-400">
            The course content is not available at the moment. Please try again later.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={goBackToCourse}
          >
            Go Back to Course
          </Button>
        </div>
      </div>
    );
  }
  
  const currentSection = courseLearningDetails.sections[activeSection];
  const currentStep = currentSection.steps[activeStep];
  
  // Calculate total steps and current step number for progress
  const totalSteps = courseLearningDetails.sections.reduce((total, section) => total + section.steps.length, 0);
  let currentStepNumber = 0;
  for (let i = 0; i < activeSection; i++) {
    currentStepNumber += courseLearningDetails.sections[i].steps.length;
  }
  currentStepNumber += activeStep + 1;
  
  const progressPercentage = Math.round((currentStepNumber / totalSteps) * 100);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={goBackToCourse}
              className="text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to course page
            </Button>
            <div className="text-center flex-1 max-w-md mx-auto">
              <h1 className="text-sm font-medium truncate">
                {courseLearningDetails.title}
              </h1>
              <div className="w-full mt-1">
                <Progress value={progressPercentage} className="h-1" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progressPercentage}% complete
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={activeSection === 0 && activeStep === 0}
                onClick={goToPreviousStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                size="sm"
                onClick={goToNextStep}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Steps */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 sticky top-20">
              <div className="p-4 border-b dark:border-slate-700">
                <h2 className="font-medium">Course Content</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalSteps} lessons • {currentStepNumber} completed
                </p>
              </div>
              
              <div className="divide-y dark:divide-slate-700">
                {courseLearningDetails.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="overflow-hidden">
                    <button
                      className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <h3 className="font-medium">{section.title}</h3>
                      <div className={`transform transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''}`}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </button>
                    
                    {expandedSections[section.id] && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700">
                        {section.steps.map((step, stepIndex) => {
                          const isActive = sectionIndex === activeSection && stepIndex === activeStep;
                          
                          return (
                            <button
                              key={step.id}
                              className={`flex items-start w-full p-3 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                                isActive ? 'bg-slate-100 dark:bg-slate-700/50' : ''
                              }`}
                              onClick={() => setActiveStepById(sectionIndex, stepIndex)}
                            >
                              <div className="mt-0.5 mr-3">
                                {step.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{step.title}</p>
                                <div className="flex items-center mt-1">
                                  {step.type === 'video' && (
                                    <>
                                      <Play className="h-3 w-3 mr-1 text-slate-400" />
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Video • {step.duration}
                                      </span>
                                    </>
                                  )}
                                  {step.type === 'text' && (
                                    <>
                                      <Info className="h-3 w-3 mr-1 text-slate-400" />
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Article
                                      </span>
                                    </>
                                  )}
                                  {step.type === 'quiz' && (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1 text-slate-400" />
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Quiz
                                      </span>
                                    </>
                                  )}
                                  {step.type === 'download' && (
                                    <>
                                      <Download className="h-3 w-3 mr-1 text-slate-400" />
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Resource
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Lesson {currentStepNumber} of {totalSteps}</span>
                  <Separator className="mx-2 h-4" orientation="vertical" />
                  {currentStep.type === 'video' && (
                    <span className="flex items-center">
                      <Play className="h-3 w-3 mr-1" />
                      Video • {currentStep.duration}
                    </span>
                  )}
                  {currentStep.type === 'text' && (
                    <span className="flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Article
                    </span>
                  )}
                  {currentStep.type === 'quiz' && (
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Quiz
                    </span>
                  )}
                  {currentStep.type === 'download' && (
                    <span className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      Resource
                    </span>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                {/* Content based on type */}
                <div className="mt-6">
                  {currentStep.type === 'video' && (
                    <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center p-6">
                        <Play className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-500">Video content would play here.</p>
                        <p className="text-sm text-slate-400 mt-1">Duration: {currentStep.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentStep.type === 'text' && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        This is the content area where the article text would be displayed for this lesson. 
                        In a real implementation, this would be rich text content from the course database.
                      </p>
                      <p>
                        The content could include formatting, images, code snippets, and other educational materials.
                      </p>
                      <h3>Example heading</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
                        fermentum lacinia, nisl nisl aliquam nisl, eget fermentum nisl nisl eget nisl.
                      </p>
                      <ul>
                        <li>First important point about the topic</li>
                        <li>Second key concept to understand</li>
                        <li>Third principle of the framework</li>
                      </ul>
                    </div>
                  )}
                  
                  {currentStep.type === 'quiz' && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Knowledge Check</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="font-medium">What are the key principles covered in this section?</p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="option1" 
                                name="quiz-question" 
                                className="mr-3"
                              />
                              <label htmlFor="option1">Option 1</label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="option2" 
                                name="quiz-question" 
                                className="mr-3"
                              />
                              <label htmlFor="option2">Option 2</label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="option3" 
                                name="quiz-question" 
                                className="mr-3"
                              />
                              <label htmlFor="option3">Option 3</label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                id="option4" 
                                name="quiz-question" 
                                className="mr-3"
                              />
                              <label htmlFor="option4">Option 4</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-6">
                        Submit Answer
                      </Button>
                    </div>
                  )}
                  
                  {currentStep.type === 'download' && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 text-center">
                      <Download className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Resource Pack Available</h3>
                      <p className="text-slate-500 mb-6">
                        Download the resources for this section to use in your projects.
                      </p>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Resources
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    disabled={activeSection === 0 && activeStep === 0}
                    onClick={goToPreviousStep}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>
                  
                  <Button
                    onClick={() => {
                      completeStep(activeSection, activeStep);
                      goToNextStep();
                    }}
                  >
                    {!currentStep.isCompleted ? "Mark as Complete" : "Next Lesson"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with ProtectedRoute
const CourseLearningPage = () => {
  return (
    <ProtectedRoute path="/courses/:courseId/learn">
      <CourseLearningContent />
    </ProtectedRoute>
  );
};

export default CourseLearningPage;