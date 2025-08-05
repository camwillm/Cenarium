import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, DollarSign, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const mealTypeColors = {
  breakfast: "bg-amber-100 text-amber-800 border-amber-200",
  lunch: "bg-blue-100 text-blue-800 border-blue-200",
  dinner: "bg-purple-100 text-purple-800 border-purple-200",
  snack: "bg-green-100 text-green-800 border-green-200"
};

const mealTypeEmojis = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🥨"
};

export default function RecentMeals({ meals }) {
  if (meals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Clock className="w-5 h-5 text-slate-600" />
              Today's Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">No meals logged yet</h3>
              <p className="text-slate-500 text-sm mb-4">Start your day by adding your first meal!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Clock className="w-5 h-5 text-slate-600" />
            Today's Meals ({meals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mealTypeEmojis[meal.meal_type]}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 capitalize">
                            {meal.meal_type}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`${mealTypeColors[meal.meal_type]} text-xs`}
                          >
                            {meal.meal_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {meal.created_date && !isNaN(new Date(meal.created_date).getTime()) ? (
  format(new Date(meal.created_date), 'h:mm a')
) : (
  "Invalid time"
)}

                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <Zap className="w-3 h-3" />
                          <span className="font-medium">{Math.round(meal.total_calories || 0)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-medium">${(meal.total_cost || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span>P: {Math.round(meal.total_protein || 0)}g</span>
                    <span>C: {Math.round(meal.total_carbs || 0)}g</span>
                    <span>F: {Math.round(meal.total_fat || 0)}g</span>
                    {meal.efficiency_score && (
                      <span className="text-emerald-600 font-medium">
                        Efficiency: {meal.efficiency_score.toFixed(1)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}