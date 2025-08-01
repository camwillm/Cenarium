import { Card, CardContent } from "@/components/ui/card";
import { Target, DollarSign, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  {
    title: "Calories Today",
    key: "calories",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-600",
    suffix: ""
  },
  {
    title: "Protein Goal",
    key: "protein",
    icon: Target,
    gradient: "from-blue-500 to-cyan-600",
    suffix: "g"
  },
  {
    title: "Today's Cost",
    key: "cost",
    icon: DollarSign,
    gradient: "from-purple-500 to-pink-600",
    prefix: "$"
  },
  {
    title: "Meals Logged",
    key: "meals",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-600",
    suffix: ""
  }
];

export default function QuickStats({ user, todayTotals, mealsCount }) {
  const getStatValue = (key: string) => {
    switch (key) {
      case 'calories':
        return Math.round(todayTotals.calories);
      case 'protein':
        return Math.round(todayTotals.protein);
      case 'cost':
        return todayTotals.cost.toFixed(2);
      case 'meals':
        return mealsCount;
      default:
        return '0';
    }
  };

  const getTargetValue = (key: string) => {
    if (!user) return null;
    switch (key) {
      case 'calories':
        return user.target_calories ? `/ ${user.target_calories}` : '';
      case 'protein':
        return user.target_protein ? `/ ${user.target_protein}g` : '';
      case 'cost':
        return user.weekly_budget ? `/ $${(user.weekly_budget / 7).toFixed(0)}` : '';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-effect border-0 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer group">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-bold text-slate-900">
                    {stat.prefix}{getStatValue(stat.key)}{stat.suffix}
                  </span>
                  {getTargetValue(stat.key) && (
                    <span className="text-sm text-slate-500 font-medium">
                      {getTargetValue(stat.key)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
