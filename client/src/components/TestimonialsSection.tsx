import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" />);
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            What Our Students Say
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Hear from our community of learners about their experiences
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="ml-4">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-20 mt-1" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials?.map((testimonial: Testimonial) => (
              <Card key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    "{testimonial.text}"
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{testimonial.program}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
