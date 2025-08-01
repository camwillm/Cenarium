import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Search as SearchIcon } from "lucide-react";

const categories = [
  "all", "protein", "carbs", "vegetables", "fruits", "dairy",
  "grains", "snacks", "beverages", "condiments", "other"
];

interface FoodSearchProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
}

export default function FoodSearch({ onSearch, onFilter }: FoodSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by food name..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 border-slate-200 focus:border-emerald-500"
        />
      </div>
      <Select onValueChange={onFilter} defaultValue="all">
        <SelectTrigger className="w-full md:w-[200px] border-slate-200 focus:border-emerald-500">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category} className="capitalize">
              {category.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
