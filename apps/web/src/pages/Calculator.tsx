import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator as CalcIcon, Target, Zap, TrendingUp, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Calculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    goal: '',
    weekly_budget: ''
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        age: userData.age || '',
        weight: userData.weight || '',
        height: userData.height || '',
        gender: userData.gender || '',
        activity_level: userData.activity_level || '',
        goal: userData.goal || '',
        weekly_budget: userData.weekly_budget || ''
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMacros = () => {
    const { age, weight, height, gender, activity_level, goal } = formData;
    
    if (!age || !weight || !height || !gender || !activity_level || !goal) {
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age)) + 5;
    } else {
      bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age)) - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const tdee = bmr * activityMultipliers[activity_level];

    // Goal adjustments
    let calories;
    switch (goal) {
      case 'cutting':
        calories = tdee - 500; // 1 lb/week deficit
        break;
      case 'bulking':
        calories = tdee + 300; // Lean bulk
        break;
      default:
        calories = tdee;
    }

    // Macro distribution
    const protein = parseFloat(weight) * 2.2; // 2.2g per kg
    const fat = calories * 0.25 / 9; // 25% of calories from fat
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

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CalcIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Nutrition Calculator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get personalized calorie and macro targets based on your goals, activity level, and body composition
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select value={formData.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                    <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (light exercise 1-3x/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5x/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard exercise 6-7x/week)</SelectItem>
                      <SelectItem value="extra_active">Extra Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                    <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cutting">Cutting (lose weight)</SelectItem>
                      <SelectItem value="maintenance">Maintenance (maintain weight)</SelectItem>
                      <SelectItem value="bulking">Bulking (gain weight)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Weekly Food Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="100"
                    value={formData.weekly_budget}
                    onChange={(e) => handleInputChange('weekly_budget', e.target.value)}
                    className="border-slate-200 focus:border-emerald-500"
                  />
                </div>

                <Button 
                  onClick={calculateMacros}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                  size="lg"
                >
                  <CalcIcon className="w-4 h-4 mr-2" />
                  Calculate My Targets
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Your Personalized Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800">BMR</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-900">{results.bmr}</p>
                        <p className="text-xs text-emerald-600">calories/day</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">TDEE</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{results.tdee}</p>
                        <p className="text-xs text-blue-600">calories/day</p>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <h3 className="font-semibold text-emerald-900 mb-4 text-center">Daily Targets</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">Calories</span>
                          <span className="text-xl font-bold text-emerald-600">{results.calories}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">Protein</span>
                          <span className="text-xl font-bold text-blue-600">{results.protein}g</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">Carbs</span>
                          <span className="text-xl font-bold text-amber-600">{results.carbs}g</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">Fat</span>
                          <span className="text-xl font-bold text-purple-600">{results.fat}g</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={saveResults}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                      size="lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save & Continue'}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <CalcIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Ready to Calculate</h3>
                    <p className="text-slate-500 text-sm">Fill out your information and click calculate to see your personalized targets</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}