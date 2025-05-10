
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  value?: string;
  suggestions?: string[];
}

const SearchBar = ({
  placeholder = 'Search for AI agents...',
  className,
  onSearch,
  value: externalValue,
  suggestions = [],
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(externalValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update internal state when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchValue(externalValue);
    }
  }, [externalValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (onSearch) {
      onSearch(value); // Real-time search
    }
    
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
  };

  const clearSearch = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
  };

  return (
    <div className={cn('relative w-full max-w-xl mx-auto', className)}>
      <form onSubmit={handleSearch} className="relative">
        <div
          className={cn(
            'flex items-center h-12 w-full bg-white border rounded-full overflow-hidden transition-all duration-300',
            isFocused 
              ? 'border-primary shadow-sm ring-2 ring-primary/10' 
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="flex items-center justify-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (searchValue && suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            className="h-full w-full bg-transparent px-4 focus:outline-none text-gray-900"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex items-center justify-center pr-4"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
