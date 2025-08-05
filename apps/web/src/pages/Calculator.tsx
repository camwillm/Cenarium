import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator as CalcIcon, Target, Zap, TrendingUp, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Types
type Gender = "male" | "female" | "other";
type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active";
type Goal = "cutting" | "maintenance" | "bulking";

interface FormData {
  age: string;
  weight: string;
  height: string;
  gender: Gender | "";
  activity_level: ActivityLevel | "";
  goal: Goal | "";
  weekly_budget: string;
}

interface MacroResults {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserData extends Partial<FormData> {
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fat?: number;
}

export default function Calculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    goal: '',
    weekly_budget: ''
  });
  const [results, setResults] = useState<MacroResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData: UserData = await User.me();
      setUser(userData);
      setFormData({
        age: userData.age ?? '',
        weight: userData.weight ?? '',
        height: userData.height ?? '',
        gender: userData.gender ?? '',
        activity_level: userData.activity_level ?? '',
        goal: userData.goal ?? '',
        weekly_budget: userData.weekly_budget ?? ''
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMacros = () => {
    const { age, weight, height, gender, activity_level, goal } = formData;

    if (!age || !weight || !height || !gender || !activity_level || !goal) return;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    let bmr: number;
    if (gender === "male") {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const tdee = bmr * activityMultipliers[activity_level as ActivityLevel];

    let calories: number;
    switch (goal) {
      case "cutting":
        calories = tdee - 500;
        break;
      case "bulking":
        calories = tdee + 300;
        break;
      default:
        calories = tdee;
    }

    const protein = w * 2.2;
    const fat = calories * 0.25 / 9;
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    });
  };

  const saveResults = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      await User.updateMyUserData({
        ...formData,
        age: parseFloat(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        weekly_budget: parseFloat(formData.weekly_budget),
        target_calories: results.calories,
        target_protein: results.protein,
        target_carbs: results.carbs,
        target_fat: results.fat
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error saving results:", error);
    }
    setIsSaving(false);
  };

  // Return unchanged — TSX typing doesn't require HTML changes
  // Just make sure all props and hooks have types where needed

  return (
    // JSX remains the same
    // ... full render block from your original JSX goes here (no changes needed)
    // (Omitted here to save space — keep the original JSX you already wrote)
    <>{/* your original render block goes here */}</>
  );
}
