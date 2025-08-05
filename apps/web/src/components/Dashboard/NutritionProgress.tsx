import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Zap, Beef, Wheat } from "lucide-react";
import { motion } from "framer-motion";

interface User {
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fat?: number;
}

interface TodayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionProgressProps {
  user?: User;
  todayTotals: TodayTotals;
}

export default function NutritionProgress({ user, todayTotals }: NutritionProgressProps) {
  if (!todayTotals) {
    return <div>Loading nutrition data...</div>;
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      amber: { bg: "bg-amber-100", text: "text-amber-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  const macros = [
    {
      name: "Calories",
      current: Math.round(todayTotals.calories),
      target: user?.target_calories || 2000,
      icon: Zap,
      color: "emerald",
      unit: ""
    },
    {
      name: "Protein",
      current: Math.round(todayTotals.protein),
      target: user?.target_protein || 150,
      icon: Beef,
      color: "blue",
      unit: "g"
    },
    {
      name: "Carbs",
      current: Math.round(todayTotals.carbs),
      target: user?.target_carbs || 250,
      icon: Wheat,
      color: "amber",
      unit: "g"
    },
    {
      name: "Fat",
      current: Math.round(todayTotals.fat),
      target: user?.target_fat || 70,
      icon: Target,
      color: "purple",
      unit: "g"
    }
  ];

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-emerald-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-slate-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Target className="w-5 h-5 text-emerald-600" />
            Today's Nutrition Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {macros.map((macro, index) => {
              const percentage = Math.min((macro.current / macro.target) * 100, 100);
              const colorClasses = getColorClasses(macro.color);
              
              return (
                <motion.div
                  key={macro.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                        <macro.icon className={`w-4 h-4 ${colorClasses.text}`} />
                      </div>
                      <span className="font-semibold text-slate-900">{macro.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {macro.current}{macro.unit} / {macro.target}{macro.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-slate-100"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{percentage.toFixed(0)}% complete</span>
                      <span className={percentage >= 100 ? "text-emerald-600 font-semibold" : ""}>
                        {percentage >= 100 ? "Goal reached! 🎉" : `${Math.round(macro.target - macro.current)}${macro.unit} remaining`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}