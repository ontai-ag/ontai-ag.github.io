
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui-custom/Card';
import { CustomButton } from '@/components/ui-custom/Button';
import AgentCard from '@/components/agents/AgentCard';

// Mock data for featured agents
const featuredAgents = [
  {
    id: '1',
    name: 'ContentMaster AI',
    description: 'Generate blog posts, articles, and marketing copy tailored to your brand voice.',
    category: 'Content Writing',
    rating: 4.9,
    reviews: 487,
    price: 0.05,
    priceModel: 'Per 1K tokens',
    image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'NexusAI'
  },
  {
    id: '2',
    name: 'CodeGenius',
    description: 'Professional-grade code generation with documentation and testing.',
    category: 'Development',
    rating: 4.8,
    reviews: 356,
    price: 0.12,
    priceModel: 'Per request',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'DevTech Solutions'
  },
  {
    id: '3',
    name: 'DataWizard',
    description: 'Analyze and visualize data with customizable dashboards and insights.',
    category: 'Data Analysis',
    rating: 4.7,
    reviews: 291,
    price: 0.25,
    priceModel: 'Per analysis',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'Analytix'
  },
  {
    id: '4',
    name: 'DesignCraft',
    description: 'Generate logos, UI elements, and graphics with stunning quality.',
    category: 'Design',
    rating: 4.6,
    reviews: 178,
    price: 0.18,
    priceModel: 'Per image',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'CreativeMinds'
  },
  {
    id: '5',
    name: 'SupportBot Pro',
    description: 'Customer service automation with human-like responses and issue resolution.',
    category: 'Customer Support',
    rating: 4.9,
    reviews: 412,
    price: 49.99,
    priceModel: 'Monthly',
    image: 'https://images.unsplash.com/photo-1596920566403-2072ed71e190?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'ServiceTech'
  }
];

const categories = [
  'All Categories',
  'Content Writing',
  'Development',
  'Data Analysis',
  'Design',
  'Customer Support',
  'Research',
  'Translation'
];

const FeaturedAgents = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h2 
              className={`text-3xl font-bold tracking-tight text-gray-900 md:text-4xl mb-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Featured AI Agents
            </h2>
            <p 
              className={`text-lg text-gray-600 md:max-w-2xl transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Discover our most popular AI agents across various specialties. Each one is optimized for specific tasks and ready to assist you.
            </p>
          </div>
          <CustomButton
            variant="outline"
            className="hidden md:flex mt-4 md:mt-0"
            rightIcon={<ChevronRight className="h-4 w-4" />}
            as={Link}
            to="/marketplace"
          >
            View All Agents
          </CustomButton>
        </div>

        {/* Category filters with horizontal scroll */}
        <div 
          className={`mb-8 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="relative">
            <div 
              className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide"
              ref={scrollRef}
              style={{ scrollbarWidth: 'none' }}
            >
              <button 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10 hidden md:flex"
                onClick={handleScrollLeft}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
              
              <button 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10 hidden md:flex"
                onClick={handleScrollRight}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured agents grid */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {featuredAgents
            .filter(agent => activeCategory === 'All Categories' || agent.category === activeCategory)
            .map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
        </div>

        <div 
          className={`mt-10 flex justify-center md:hidden transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <CustomButton
            variant="outline"
            rightIcon={<ChevronRight className="h-4 w-4" />}
            as={Link}
            to="/marketplace"
          >
            View All Agents
          </CustomButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgents;
