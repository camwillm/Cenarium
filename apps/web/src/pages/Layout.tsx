import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { User } from "../api/entities";
import { MealPlan } from "../api/entities";
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

// ------------------
// Types
// ------------------
interface NavigationItem {
  title: string;
  url: string;
  icon: React.ElementType;
  gradient: string;
}

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

interface UserData {
  email?: string;
  first_name?: string;
  weekly_budget?: number;
  target_calories?: number;
  [key: string]: any;
}

interface MealEntry {
  total_calories?: number;
  total_cost?: number;
  [key: string]: any;
}

// ------------------
// Component
// ------------------
const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    title: "Calculator",
    url: createPageUrl("Calculator"),
    icon: Calculator,
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    title: "Food Database",
    url: createPageUrl("Foods"),
    icon: Search,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Meal Planner",
    url: createPageUrl("MealPlanner"),
    icon: Calendar,
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: UserIcon,
    gradient: "from-indigo-500 to-purple-600"
  }
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [todayTotals, setTodayTotals] = useState<{ calories: number; cost: number }>({ calories: 0, cost: 0 });

  useEffect(() => {
    const loadLayoutData = async () => {
      try {
        const userData: UserData = await User.me();
        setUser(userData);

        const today = format(new Date(), "yyyy-MM-dd");
        const meals: MealEntry[] = await MealPlan.filter({
          date: today,
          created_by: userData.email
        });

        const totals = meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + (meal.total_calories || 0),
            cost: acc.cost + (meal.total_cost || 0)
          }),
          { calories: 0, cost: 0 }
        );

        setTodayTotals(totals);
      } catch (error) {
        console.warn("Could not load user or meal plan data:", error);
      }
    };

    loadLayoutData();
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
            --secondary-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            --background-gradient: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --surface: rgba(255, 255, 255, 0.95);
            --surface-hover: rgba(255, 255, 255, 0.8);
            --border: rgba(148, 163, 184, 0.2);
          }

          body {
            background: var(--background-gradient);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .glass-effect {
            background: var(--surface);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
          }

          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .gradient-text {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>

      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r-0 glass-effect">
          <SidebarHeader className="border-b border-slate-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl gradient-text">Cenarium</h2>
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
                        <SidebarMenuButton
                          asChild
                          className={`group relative overflow-hidden rounded-xl transition-all duration-300 h-12
                            ${isActive
                              ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                              : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                                ${isActive
                                  ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                                  : "bg-slate-100 group-hover:bg-slate-200"}
                              `}
                            >
                              <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                            </div>
                            <span className="font-semibold text-sm">{item.title}</span>
                            {isActive && <div className="absolute right-2 w-2 h-2 rounded-full bg-emerald-500" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-emerald-800">Today's Goals</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-emerald-700">
                  <span>Calories</span>
                  <span className="font-semibold">
                    {Math.round(todayTotals.calories)} / {user?.target_calories ?? "..."}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Budget</span>
                  <span className="font-semibold">
                    ${todayTotals.cost.toFixed(2)} / $
                    {user?.weekly_budget ? (user.weekly_budget / 7).toFixed(2) : "..."}
                  </span>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/50 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold text-sm">
                  {user ? user.first_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U" : "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {user ? user.first_name ?? user.email : "Guest"}
                </p>
                <p className="text-xs text-slate-500 truncate">Optimize your nutrition</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="glass-effect border-b border-slate-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold gradient-text">Cenarium</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
