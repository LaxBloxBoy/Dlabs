import { CheckIcon, CodeIcon, AwardIcon, SmartphoneIcon } from "lucide-react";

const features = [
  {
    icon: <CodeIcon className="text-white text-xl" />,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience in their fields."
  },
  {
    icon: <AwardIcon className="text-white text-xl" />,
    title: "Recognized Certifications",
    description: "Earn certificates that are recognized and valued by employers globally."
  },
  {
    icon: <SmartphoneIcon className="text-white text-xl" />,
    title: "Learn Anywhere",
    description: "Access your courses on any device, anytime, with our responsive platform."
  }
];

const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Why Choose LearnHub</h2>
          <p className="mt-1 text-4xl font-serif font-bold text-slate-900 sm:text-5xl sm:tracking-tight">
            Learning made simple
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-slate-500">
            Our platform makes it easy to discover, learn, and apply new skills to advance your career.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div className="pt-6" key={index}>
                <div className="flow-root bg-slate-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-slate-900 tracking-tight">{feature.title}</h3>
                    <p className="mt-5 text-base text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
