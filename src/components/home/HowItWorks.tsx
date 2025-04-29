
import React, { useState, useEffect } from 'react';
import { Play, MousePointerClick, Sparkles, CreditCard, CheckCheck } from 'lucide-react';
import { CustomButton } from '@/components/ui-custom/Button';

const steps = [
  {
    id: 1,
    title: 'Browse & Select',
    description: 'Find the perfect AI agent for your task from our marketplace of specialized tools.',
    icon: <MousePointerClick className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    title: 'Submit Your Task',
    description: 'Provide details, requirements, and any relevant files or references.',
    icon: <Play className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 3,
    title: 'AI Processing',
    description: 'Our specialized AI agent works on your task with precision and expertise.',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 4,
    title: 'Review & Pay',
    description: 'Get results in real-time, provide feedback, and only pay for what you approve.',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    id: 5,
    title: 'Done',
    description: 'Download your completed work and enjoy the efficiency of specialized AI.',
    icon: <CheckCheck className="h-6 w-6" />,
    color: 'bg-green-100 text-green-600',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });
    
    const element = document.getElementById('how-it-works-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  useEffect(() => {
    // Auto-cycle through steps
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === steps.length ? 1 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section id="how-it-works-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className={`text-3xl font-bold tracking-tight text-gray-900 md:text-4xl mb-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            How It Works
          </h2>
          <p 
            className={`text-lg text-gray-600 md:max-w-2xl mx-auto transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Get from task to completion in minutes with our streamlined process
          </p>
        </div>

        {/* Steps visualization */}
        <div 
          className={`max-w-4xl mx-auto mb-16 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Progress indicators */}
          <div className="flex justify-between mb-10 relative">
            {/* Connector line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary transition-all duration-1000 -z-10"
              style={{ width: `${(activeStep - 1) * 25}%` }}
            ></div>
            
            {steps.map((step) => (
              <button
                key={step.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.id === activeStep
                    ? step.color + ' ring-4 ring-white shadow-md'
                    : step.id < activeStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                {step.id < activeStep ? (
                  <CheckCheck className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </button>
            ))}
          </div>
          
          {/* Active step details */}
          <div className="bg-white rounded-2xl shadow-soft p-8 transition-all duration-300 transform">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${steps[activeStep - 1].color}`}>
                {steps[activeStep - 1].icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">{steps[activeStep - 1].title}</h3>
                <p className="text-gray-600">{steps[activeStep - 1].description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div 
          className={`text-center transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <CustomButton size="lg" className="rounded-full">
            Get Started Now
          </CustomButton>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
