import { useState, useEffect } from "react";
import { User } from "../entities/User";
import { MealPlan } from "../entities/MealPlan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils/createPageUrl";
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Plus,
  Clock,
  Award,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import QuickStats from "@/components/Dashboard/QuickStats";
import NutritionProgress from "@/components/Dashboard/NutritionProgress";
import RecentMeals from "@/components/Dashboard/RecentMeals";
import WeeklyOverview from "@/components/Dashboard/WeeklyOverview";

// TypeScript Interfaces
interface User {
  email?: string;
  goal?: string;
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fat?: number;
}

interface Meal {
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_cost?: number;
  date?: string;
  created_by?: string;
}

interface TodayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const meals = await MealPlan.filter({ 
        date: today,
        created_by: userData.email 
      }, '-created_date');
      setTodayMeals(meals);
    } catch (error) {
      console.error("Error loading data:", error);
      setUser(null);
      setTodayMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const todayTotals: TodayTotals = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.total_calories || 0),
    protein: acc.protein + (meal.total_protein || 0),
    carbs: acc.carbs + (meal.total_carbs || 0),
    fat: acc.fat + (meal.total_fat || 0),
    cost: acc.cost + (meal.total_cost || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              {user?.goal ? `Let's optimize your ${user.goal} journey` : "Let's get started with your nutrition goals"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Calculator")}>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover-lift">
                <Target className="w-4 h-4 mr-2" />
                Set Goals
              </Button>
            </Link>
            <Link to={createPageUrl("MealPlanner")}>
              <Button variant="outline" className="border-slate-200 hover:bg-slate-50 hover-lift">
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats 
          user={user}
          todayTotals={todayTotals}
          mealsCount={todayMeals?.length || 0}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NutritionProgress 
              user={user}
              todayTotals={todayTotals}
            />
            <RecentMeals meals={todayMeals || []} />
          </div>
          
          <div className="space-y-8">
            <WeeklyOverview />
            
            {/* Achievement Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect border-0 shadow-xl hover-lift">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Award className="w-5 h-5 text-amber-500" />
                    Achievement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Getting Started!</h3>
                    <p className="text-sm text-slate-600">
                      Complete your profile to unlock personalized recommendations
                    </p>
                    <Link to={createPageUrl("Profile")} className="inline-block mt-4">
                      <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}