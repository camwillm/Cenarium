import { useState, useEffect } from "react";
import { Food } from "@/entities/Food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

import FoodSearch from "../components/foods/FoodSearch";
import FoodTable from "../components/foods/FoodTable";
import AddFoodForm from "../components/foods/AddFoodForm";

export default function FoodsPage() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setIsLoading(true);
    try {
      const allFoods = await Food.list("-created_date");
      setFoods(allFoods);
    } catch (error) {
      console.error("Error loading foods:", error);
    }
    setIsLoading(false);
  };
  
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const nameMatch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || food.category === categoryFilter;
      return nameMatch && categoryMatch;
    });
  }, [foods, searchTerm, categoryFilter]);

  const handleFoodAdded = (newFood) => {
    setFoods(prev => [newFood, ...prev]);
    setIsFormOpen(false);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Food Database</h1>
            <p className="text-slate-600 mt-2 text-lg">
              Analyze and manage your food items and their costs
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover-lift"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Food
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Search className="w-5 h-5 text-slate-600" />
                Find Foods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FoodSearch
                onSearch={setSearchTerm}
                onFilter={setCategoryFilter}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FoodTable foods={filteredFoods} isLoading={isLoading} />
        </motion.div>
      </div>
      
      <AddFoodForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
}