
import { Building2, Users, MessageSquare } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Company Section */}
      <section id="company" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Company</h2>
          </div>
          <p className="text-lg text-slate-600 mb-8">
            D-Code Labs is dedicated to providing high-quality tech education accessible to everyone. 
            Our platform combines expert instruction with hands-on learning to help you master the 
            skills needed in today's digital world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600">To empower individuals with cutting-edge technical skills through accessible, high-quality education.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Vision</h3>
              <p className="text-slate-600">To be the leading platform for tech education, creating opportunities for learners worldwide.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Values</h3>
              <p className="text-slate-600">Excellence, innovation, accessibility, and continuous learning guide everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Meet Our Instructors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Senior Software Engineer",
                expertise: "Web Development",
                image: "https://placehold.co/400x400"
              },
              {
                name: "Michael Chen",
                role: "AI Researcher",
                expertise: "Machine Learning",
                image: "https://placehold.co/400x400"
              },
              {
                name: "Emily Rodriguez",
                role: "UX Designer",
                expertise: "UI/UX Design",
                image: "https://placehold.co/400x400"
              }
            ].map((instructor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <img 
                  src={instructor.image} 
                  alt={instructor.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{instructor.name}</h3>
                  <p className="text-emerald-600 font-medium">{instructor.role}</p>
                  <p className="text-slate-600 mt-2">Specializes in {instructor.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Student Testimonials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "Frontend Developer",
                text: "The courses here helped me transition into tech. The instructors are amazing and the content is top-notch."
              },
              {
                name: "Maria Garcia",
                role: "Data Scientist",
                text: "The practical approach to learning made all the difference. I'm now confidently working on real-world projects."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-slate-600 italic mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
