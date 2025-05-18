
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/common/SearchBar';
import AgentCard from '@/components/agents/AgentCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, SlidersHorizontal, Star, ChevronDown, XCircle } from 'lucide-react';

// Mock data for marketplace agents (using the same structure as featured agents)
const allAgents = [
  // {
  //   id: '1',
  //   name: 'Ai Pradavan',
  //   description: 'Цифровой менеджер по продажам',
  //   category: 'Customer Support',
  //   rating: 4,
  //   reviews: 11,
  //   price: 0.12,
  //   priceModel: 'Per request',
  //   image: '/2aiprod.png',
  //   provider: 'AiPradavan'
  // },
  // {
  //   id: '2',
  //   name: 'CodeGenius',
  //   description: 'Professional-grade code generation with documentation and testing.',
  //   category: 'Development',
  //   rating: 4.8,
  //   reviews: 356,
  //   price: 0.12,
  //   priceModel: 'Per request',
  //   image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  //   provider: 'DevTech Solutions'
  // },
  {
    id: '3',
    name: 'LinguaGenius',
    description: 'Профессиональный переводчик с поддержкой более 50 языков и сохранением контекста.',
    category: 'Translation',
    rating: 4.9,
    reviews: 423,
    price: 0.08,
    priceModel: 'Per 1K tokens',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    provider: 'TranslateAI'
  },
  
];



// Define category keys for translation
const categoryKeys = {
  'All Categories': 'marketplace.filters.categories.all',
  'Content Writing': 'marketplace.filters.categories.contentWriting',
  'Development': 'marketplace.filters.categories.development',
  'Data Analysis': 'marketplace.filters.categories.dataAnalysis',
  'Design': 'marketplace.filters.categories.design',
  'Customer Support': 'marketplace.filters.categories.customerSupport',
  'Research': 'marketplace.filters.categories.research',
  'Translation': 'marketplace.filters.categories.translation'
};

const categories = Object.keys(categoryKeys);

// Define rating filter options with keys
const ratingOptions = [
  { value: 0, key: 'marketplace.filters.rating.any' },
  { value: 3, key: 'marketplace.filters.rating.3plus' },
  { value: 3.5, key: 'marketplace.filters.rating.3_5plus' },
  { value: 4, key: 'marketplace.filters.rating.4plus' },
  { value: 4.5, key: 'marketplace.filters.rating.4_5plus' },
];

// Define sort options with keys
const sortOptions = [
  { value: 'relevance', key: 'marketplace.sortBy.relevance' },
  { value: 'rating', key: 'marketplace.sortBy.rating' },
  { value: 'reviews', key: 'marketplace.sortBy.reviews' },
  { value: 'price-low', key: 'marketplace.sortBy.priceLow' },
  { value: 'price-high', key: 'marketplace.sortBy.priceHigh' },
];

const Marketplace = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('relevance');
  const [filteredAgents, setFilteredAgents] = useState(allAgents);
  const [showFilters, setShowFilters] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate page load
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...allAgents];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter((agent) => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter((agent) => agent.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter((agent) => 
      agent.price >= priceRange[0] && agent.price <= priceRange[1]
    );
    
    // Filter by rating
    result = result.filter((agent) => agent.rating >= minRating);
    
    // Sort results
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'reviews') {
      result.sort((a, b) => b.reviews - a.reviews);
    }
    
    setFilteredAgents(result);
  }, [searchTerm, selectedCategory, priceRange, minRating, sortOption]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories'); // Keep internal state as English key
    setPriceRange([0, 50]);
    setMinRating(0);
    setSortOption('relevance');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16 page-transition">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`mb-8 transition-all duration-500 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t('marketplace.title')}</h1>
            <p className="text-muted-foreground text-lg">{t('marketplace.description')}</p>
          </div>
          
          <div className={`mb-8 transition-all duration-500 delay-100 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SearchBar 
              placeholder={t('marketplace.searchPlaceholder')} 
              onSearch={setSearchTerm}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters panel - Mobile toggle */}
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('marketplace.mobileFiltersButton')}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Filters panel */}
            <div 
              className={`md:w-72 transition-all duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'} ${
                showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 md:max-h-[1000px] overflow-hidden opacity-0 md:opacity-100'
              }`}
            >
              <div className="bg-card rounded-lg border border-border shadow-sm p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">{t('marketplace.filters.title')}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-sm text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    {t('marketplace.filters.clearAll')}
                  </Button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">{t('marketplace.filters.categories.title')}</h4>
                  <div className="space-y-2">
                    {categories.map((categoryKey) => (
                      <div key={categoryKey} className="flex items-center">
                        <Checkbox 
                          id={`category-${categoryKey}`}
                          checked={selectedCategory === categoryKey} // Compare with English key
                          onCheckedChange={() => setSelectedCategory(categoryKey)} // Set English key
                        />
                        <Label 
                          htmlFor={`category-${categoryKey}`}
                          className="ml-2 text-sm cursor-pointer text-foreground"
                        >
                          {t(categoryKeys[categoryKey as keyof typeof categoryKeys])} {/* Translate label */}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">{t('marketplace.filters.priceRange.title')}</h4>
                  <Slider
                    defaultValue={[0, 50]}
                    max={50}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">${priceRange[0]}</span>
                    <span className="text-foreground">${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">{t('marketplace.filters.rating.title')}</h4>
                  <div className="space-y-2">
                    {ratingOptions.map(({ value, key }) => (
                      <div key={value} className="flex items-center">
                        <Checkbox 
                          id={`rating-${value}`}
                          checked={minRating === value}
                          onCheckedChange={() => setMinRating(value)}
                        />
                        <Label 
                          htmlFor={`rating-${value}`}
                          className="ml-2 text-sm cursor-pointer flex items-center text-foreground"
                        >
                          {value > 0 ? (
                            <>
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                              {t(key, { rating: value })} {/* Translate rating label */}
                            </>
                          ) : (
                            t(key) // Translate 'Any rating'
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {/* Sort options */}
              <div className={`mb-6 flex items-center justify-between transition-all duration-500 delay-200 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('marketplace.results.showing')}</span>{' '}
                  <span className="font-medium text-foreground">{filteredAgents.length}</span>{' '}
                  <span className="text-muted-foreground">{t('marketplace.results.results', { count: filteredAgents.length })}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-muted-foreground">{t('marketplace.sortBy.label')}</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-0 text-foreground"
                  >
                    {sortOptions.map(({ value, key }) => (
                      <option key={value} value={value}>{t(key)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Agents grid */}
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 delay-300 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    // Assuming AgentCard handles its own translations or receives translated props
                    <AgentCard key={agent.id} agent={agent} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <h3 className="text-xl font-medium mb-2 text-foreground">{t('marketplace.noResults.title')}</h3>
                    <p className="text-muted-foreground mb-4">{t('marketplace.noResults.description')}</p>
                    <Button onClick={clearFilters}>{t('marketplace.noResults.clearFiltersButton')}</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
