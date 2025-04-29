
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Bot, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui-custom/Button';
import SearchBar from '@/components/common/SearchBar';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const searchSuggestions = [
    'Content writing agents',
    'Data analysis tools',
    'Code generation',
    'Image processing',
    'Customer support bots',
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50 pt-28 pb-20 md:pt-32 md:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-gray-50"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[center_top_-1px] [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
      
      {/* Content container */}
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="mr-1">✨</span> Introducing the AI Agents Marketplace
          </div>
          
          <h1 
            className={`mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="block">Specialized AI Agents</span>
            <span className="block text-primary">For Every Task</span>
          </h1>
          
          <p 
            className={`mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            The premier marketplace where businesses and individuals can instantly hire specialized AI agents for tasks—on-demand, with transparent pricing and guaranteed quality.
          </p>
          
          <div 
            className={`flex flex-col md:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <CustomButton
              size="lg"
              className="rounded-full text-base px-8"
              rightIcon={<ChevronRight className="h-5 w-5" />}
              as={Link}
              to="/marketplace"
            >
              Browse AI Agents
            </CustomButton>
            <CustomButton
              size="lg"
              variant="glass"
              className="rounded-full text-base px-8"
              as={Link}
              to="/for-providers"
            >
              Become a Provider
            </CustomButton>
          </div>
          
          <div 
            className={`mt-14 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <SearchBar 
              suggestions={searchSuggestions}
              onSearch={(value) => console.log('Search for:', value)}
              className="shadow-md"
            />
          </div>
          
          <div 
            className={`mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">100+ Specialized Agents</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Lightning-Fast Delivery</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Enterprise-Grade Security</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blurred circles for decoration */}
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Hero;
