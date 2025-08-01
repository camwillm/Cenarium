import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { MealPlan } from "@/entities/MealPlan";
import { format } from "date-fns";
import {
  Calculator,
  LayoutDashboard,
  Search,
  Calendar,
  User as UserIcon,
  Target,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard, gradient: "from-emerald-500 to-teal-600" },
  { title: "Calculator", url: createPageUrl("Calculator"), icon: Calculator, gradient: "from-blue-500 to-cyan-600" },
  { title: "Food Database", url: createPageUrl("Foods"), icon: Search, gradient: "from-purple-500 to-pink-600" },
  { title: "Meal Planner", url: createPageUrl("MealPlanner"), icon: Calendar, gradient: "from-orange-500 to-red-600" },
  { title: "Profile", url: createPageUrl("Profile"), icon: UserIcon, gradient: "from-indigo-500 to-purple-600" }
];

export default function Layout({ children, currentPageName }: { children: React.ReactNode; currentPageName: string }) {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, cost: 0 });

  useEffect(() => {
    const loadLayoutData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);

        const today = format(new Date(), 'yyyy-MM-dd');
        const meals = await MealPlan.filter({ date: today, created_by: userData.email });

        const totals = meals.reduce((acc, meal) => ({
          calories: acc.calories + (meal.total_calories || 0),
          cost: acc.cost + (meal.total_cost || 0)
        }), { calories: 0, cost: 0 });

        setTodayTotals(totals);
      } catch (error) {
        console.warn("Could not load user or meal plan data:", error);
      }
    };
    loadLayoutData();
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-100 to-slate-200 font-sans">
        <Sidebar className="bg-white/90 backdrop-blur border border-slate-300/20">
          <SidebarHeader className="border-b border-slate-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">Cenarium</h2>
                <p className="text-xs text-slate-500 font-medium">Smart Nutrition</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className={`transition-all rounded-xl h-12 ${isActive ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-sm' : ''}`}>
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3 relative">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? `bg-gradient-to-br ${item.gradient} shadow-lg` : 'bg-slate-100'}`}>
                              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            </div>
                            <span className="font-semibold text-sm">{item.title}</span>
                            {isActive && <div className="absolute right-2 w-2 h-2 bg-emerald-500 rounded-full" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-emerald-800">Today's Goals</h3>
              </div>
              <div className="space-y-2 text-sm text-emerald-900">
                <div className="flex justify-between">
                  <span>Calories</span>
                  <span className="font-semibold">{Math.round(todayTotals.calories)} / {user?.target_calories || '...'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget</span>
                  <span className="font-semibold">${todayTotals.cost.toFixed(2)} / ${user?.weekly_budget ? (user.weekly_budget / 7).toFixed(2) : '...'}</span>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/50 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold text-sm">
                  {user ? user.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U' : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {user ? user.first_name || user.email : 'Guest'}
                </p>
                <p className="text-xs text-slate-500 truncate">Optimize your nutrition</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white/90 backdrop-blur border-b border-slate-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">Cenarium</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
