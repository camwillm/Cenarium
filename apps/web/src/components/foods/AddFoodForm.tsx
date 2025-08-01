import { useState } from "react";
import { Food } from "../../entities/Food";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { Save, Utensils } from "lucide-react";
import { motion } from "framer-motion";

// 🍽 Available Categories
const categories = [
  "protein", "carbs", "vegetables", "fruits", "dairy",
  "grains", "snacks", "beverages", "condiments", "other"
];

// 📦 Form State Interface
interface FoodFormState {
  name: string;
  brand: string;
  category: string;
  calories_per_100g: string;
  protein_per_100g: string;
  carbs_per_100g: string;
  fat_per_100g: string;
  fiber_per_100g: string;
  price_per_unit: string;
  unit_weight: string;
  store: string;
}

// 🔢 Props Interface
interface AddFoodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: (food: any) => void;
}

const initialFormState: FoodFormState = {
  name: '',
  brand: '',
  category: '',
  calories_per_100g: '',
  protein_per_100g: '',
  carbs_per_100g: '',
  fat_per_100g: '',
  fiber_per_100g: '',
  price_per_unit: '',
  unit_weight: '',
  store: ''
};

export default function AddFoodForm({ isOpen, onClose, onFoodAdded }: AddFoodFormProps) {
  const [formData, setFormData] = useState<FoodFormState>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof FoodFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSave = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (
          [
            'calories_per_100g', 'protein_per_100g', 'carbs_per_100g',
            'fat_per_100g', 'fiber_per_100g', 'price_per_unit', 'unit_weight'
          ].includes(key)
        ) {
          return [key, parseFloat(value) || 0];
        }
        return [key, value];
      })
    );

    try {
      const newFood = await Food.create(dataToSave);
      onFoodAdded(newFood);
      setFormData(initialFormState);
    } catch (error) {
      console.error("Failed to save food:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-effect border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Utensils className="w-6 h-6 text-emerald-600" />
            Add a New Food Item
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the details for the new food item to add it to your database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4"
          >
            {/* 🥣 Basic Details */}
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 🔬 Nutrition Section */}
            <h3 className="md:col-span-2 text-lg font-semibold text-slate-800 pt-4 border-t border-slate-200/80">Nutrition (per 100g)</h3>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input id="calories" type="number" value={formData.calories_per_100g} onChange={(e) => handleInputChange('calories_per_100g', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" value={formData.protein_per_100g} onChange={(e) => handleInputChange('protein_per_100g', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" value={formData.carbs_per_100g} onChange={(e) => handleInputChange('carbs_per_100g', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" value={formData.fat_per_100g} onChange={(e) => handleInputChange('fat_per_100g', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input id="fiber" type="number" value={formData.fiber_per_100g} onChange={(e) => handleInputChange('fiber_per_100g', e.target.value)} />
            </div>

            {/* 💰 Pricing Details */}
            <h3 className="md:col-span-2 text-lg font-semibold text-slate-800 pt-4 border-t border-slate-200/80">Pricing</h3>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" value={formData.price_per_unit} onChange={(e) => handleInputChange('price_per_unit', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Unit Weight (g)</Label>
              <Input id="weight" type="number" value={formData.unit_weight} onChange={(e) => handleInputChange('unit_weight', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store">Store</Label>
              <Input id="store" value={formData.store} onChange={(e) => handleInputChange('store', e.target.value)} />
            </div>
          </motion.div>

          {/* ✅ Actions */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Food'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
