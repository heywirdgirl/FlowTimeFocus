import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const CATEGORIES = [
  { value: 'all', label: 'All Cycles' },
  { value: 'work', label: 'Work & Focus' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'custom', label: 'Custom' },
];

interface FilterBarProps {
  category: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilterBar({ category, onCategoryChange, searchQuery, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search cycles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Category tabs */}
      <Tabs value={category} onValueChange={onCategoryChange}>
        <TabsList>
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}