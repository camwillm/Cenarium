import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";


import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";


import { TrendingUp, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 📘 Category Color Mapping
const categoryColors: Record<string, string> = {
  protein: "bg-blue-100 text-blue-800 border-blue-200",
  carbs: "bg-amber-100 text-amber-800 border-amber-200",
  vegetables: "bg-green-100 text-green-800 border-green-200",
  fruits: "bg-pink-100 text-pink-800 border-pink-200",
  dairy: "bg-slate-100 text-slate-800 border-slate-200",
  default: "bg-gray-100 text-gray-800 border-gray-200"
};

// 🔢 Efficiency Color Logic
const getEfficiencyColor = (score: number): string => {
  if (score > 10) return "text-emerald-600";
  if (score > 5) return "text-blue-600";
  if (score > 2) return "text-amber-600";
  return "text-slate-500";
};

// 🍱 Food Item Interface
interface FoodItem {
  id: string | number;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  fiber_per_100g?: number;
  price_per_unit: number;
  unit_weight: number;
}

// 📦 Props Interface
interface FoodTableProps {
  foods: FoodItem[];
  isLoading: boolean;
}

export default function FoodTable({ foods, isLoading }: FoodTableProps) {
  const calculateMetrics = (food: FoodItem) => {
    const pricePer100g = (food.price_per_unit / food.unit_weight) * 100;

    let efficiencyScore = 0;
    if (pricePer100g > 0) {
      efficiencyScore =
        ((food.protein_per_100g * 2) + (food.fiber_per_100g ?? 0)) / pricePer100g;
    }

    return {
      pricePer100g: isNaN(pricePer100g) ? 0 : pricePer100g,
      efficiencyScore: isNaN(efficiencyScore) ? 0 : efficiencyScore,
    };
  };

  if (isLoading) {
    return (
      <Card className="glass-effect border-0 shadow-xl overflow-hidden">
        <div className="p-6 space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-0 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Food</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Calories</TableHead>
              <TableHead className="text-right">Protein</TableHead>
              <TableHead className="text-right">Price/100g</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {foods.map((food) => {
                const { pricePer100g, efficiencyScore } = calculateMetrics(food);
                return (
                  <motion.tr
                    key={food.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-semibold text-slate-900">{food.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`capitalize ${categoryColors[food.category] || categoryColors.default}`}>
                        {food.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">{food.calories_per_100g} kcal</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">{food.protein_per_100g}g</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 font-medium text-slate-700">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        {pricePer100g.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold ${getEfficiencyColor(efficiencyScore)}`}>
                        <TrendingUp className="w-4 h-4" />
                        {efficiencyScore.toFixed(1)}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {!isLoading && foods.length === 0 && (
          <div className="text-center p-12 text-slate-500">
            <p className="font-semibold mb-2">No foods found</p>
            <p className="text-sm">Try adjusting your search or filter, or add a new food item.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
