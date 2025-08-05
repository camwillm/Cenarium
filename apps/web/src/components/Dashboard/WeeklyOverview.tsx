import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function WeeklyOverview() {
  const weekData = [
    { day: 'Mon', calories: 1850, cost: 12.50 },
    { day: 'Tue', calories: 2100, cost: 15.20 },
    { day: 'Wed', calories: 1950, cost: 11.80 },
    { day: 'Thu', calories: 2200, cost: 16.40 },
    { day: 'Fri', calories: 1800, cost: 13.60 },
    { day: 'Sat', calories: 2300, cost: 18.20 },
    { day: 'Sun', calories: 0, cost: 0 }
  ];

  const maxCalories = Math.max(...weekData.map(d => d.calories));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="w-5 h-5 text-slate-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-medium text-slate-500 w-8">
                  {day.day}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {day.calories} cal
                    </span>
                    <span className="text-sm text-slate-500">
                      ${day.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.calories / maxCalories) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Avg: 1,743 calories/day • $12.53/day
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}