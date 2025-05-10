
import React from 'react';
import { 
  FileText, 
  FileJson, 
  FileSpreadsheet, 
  FileImage, 
  FileType, 
  ChevronDown 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
// import { OutputFormat } from '@/integrations/supabase/client'; // TODO: [SUPABASE_REMOVAL] Type moved locally

// TODO: [SUPABASE_REMOVAL] Define OutputFormat locally if no longer available from a central types file.
export type OutputFormat = 'text' | 'pdf' | 'json' | 'csv' | 'image';

interface OutputFormatSelectorProps {
  currentFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  className?: string;
  disabled?: boolean;
}

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({
  currentFormat,
  onFormatChange,
  className = '',
  disabled = false
}) => {
  // Format options with icons
  const formatOptions: { value: OutputFormat; label: string; icon: React.ReactNode }[] = [
    { value: 'text', label: 'Text', icon: <FileText className="h-4 w-4" /> },
    { value: 'pdf', label: 'PDF', icon: <FileType className="h-4 w-4" /> },
    { value: 'json', label: 'JSON', icon: <FileJson className="h-4 w-4" /> },
    { value: 'csv', label: 'CSV', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { value: 'image', label: 'Image', icon: <FileImage className="h-4 w-4" /> }
  ];
  
  // Get the current format's details
  const currentFormatOption = formatOptions.find(option => option.value === currentFormat) || formatOptions[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center ${className}`}
          disabled={disabled}
        >
          {currentFormatOption.icon}
          <span className="mx-2">{currentFormatOption.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formatOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFormatChange(option.value)}
            className="flex items-center cursor-pointer"
          >
            {option.icon}
            <span className="ml-2">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OutputFormatSelector;
