import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Filter, ChevronDown, XCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/common/SearchBar';
import AgentCard from '@/components/agents/AgentCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
// import { supabase } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Supabase client import removed
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface AgentData {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  priceModel: string;
  image: string;
  provider: string;
}

// Categories for filtering
const categories = [
  'All Categories',
  'text-generation',
  'image-generation',
  'data-analysis',
  'conversational-ai',
  'code-generation',
  'translation',
  'other'
];

const AgentMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('relevance');
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch agents from Supabase
  useEffect(() => {
    const fetchAgents = async () => {
      // TODO: [SUPABASE_REMOVAL] Implement alternative data fetching logic or use mock data
      console.warn('Supabase fetchAgents called, but Supabase is being removed. Using mock data or no data.');
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Example: Set empty agents list or mock data
      const mockAgents: AgentData[] = [
        // Add some mock agent data here if needed for UI testing
        // {
        //   id: 'mock-1',
        //   name: 'Mock Agent 1',
        //   description: 'This is a mock agent for testing purposes.',
        //   category: 'text-generation',
        //   rating: 4.5,
        //   reviews: 120,
        //   price: 10,
        //   priceModel: 'Monthly',
        //   image: 'https://source.unsplash.com/300x200/?technology',
        //   provider: 'Mock Provider'
        // },
      ];
      setAgents(mockAgents);
      setFilteredAgents(mockAgents);
      
      toast({
        title: "Data Loading Placeholder",
        description: "Agent data fetching is disabled due to Supabase removal. Displaying placeholder or no data.",
        variant: "default"
      });
      setIsLoading(false);
    };
    
    fetchAgents();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let result = [...agents];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(agent => agent.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(agent => 
      (agent.price || 0) >= priceRange[0] && (agent.price || 0) <= priceRange[1]
    );
    
    // Filter by rating
    result = result.filter(agent => (agent.rating || 0) >= minRating);
    
    // Sort results
    if (sortOption === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'reviews') {
      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    
    setFilteredAgents(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, priceRange, minRating, sortOption, agents]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setPriceRange([0, 100]);
    setMinRating(0);
    setSortOption('relevance');
  };

  // Paginated results
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Generate page numbers
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16 page-transition">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AI Agents Marketplace</h1>
            <p className="text-gray-600 text-lg">Find the perfect AI agent for your specific task</p>
          </div>
          
          <div className="mb-8">
            <SearchBar 
              placeholder="Search for agents by name, description, or category..." 
              onSearch={setSearchTerm}
              value={searchTerm}
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
                  Filters
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Filters panel */}
            <div 
              className={`md:w-72 transition-all duration-300 ${
                showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 md:max-h-[1000px] overflow-hidden opacity-0 md:opacity-100'
              }`}
            >
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-sm text-gray-500 hover:text-gray-900"
                    onClick={clearFilters}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label 
                          htmlFor={`category-${category}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <Checkbox 
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={() => setMinRating(rating)}
                        />
                        <Label 
                          htmlFor={`rating-${rating}`}
                          className="ml-2 text-sm cursor-pointer flex items-center"
                        >
                          {rating > 0 ? (
                            <>
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                              {rating}+
                            </>
                          ) : (
                            'Any rating'
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
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Showing</span>{' '}
                  <span className="font-medium">{filteredAgents.length}</span>{' '}
                  <span className="text-gray-500">results</span>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-0"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rating</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="flex flex-col h-full">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Agents grid */}
                  {filteredAgents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedAgents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <h3 className="text-xl font-medium mb-2">No agents found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                      <Button onClick={clearFilters}>Clear Filters</Button>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {filteredAgents.length > itemsPerPage && (
                    <div className="mt-10">
                      <Pagination>
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                            </PaginationItem>
                          )}
                          
                          {renderPagination()}
                          
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentMarketplace;
