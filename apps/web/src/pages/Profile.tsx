import { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserIcon, Save, Activity, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Toaster, toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    goal: '',
    weekly_budget: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
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
      toast.error("Failed to load user data.");
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAndSaveChanges = async () => {
    const { age, weight, height, gender, activity_level, goal } = formData;
    
    if (!age || !weight || !height || !gender || !activity_level || !goal) {
      toast.error("Please fill in all fields to save your profile.");
      return;
    }

    setIsSaving(true);
    
    // BMR Calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
      bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age)) + 5;
    } else {
      bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseFloat(age)) - 161;
    }

    // TDEE Calculation
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };
    const tdee = bmr * activityMultipliers[activity_level];

    // Calorie targets based on goal
    let calories;
    switch (goal) {
      case 'cutting': calories = tdee - 500; break;
      case 'bulking': calories = tdee + 300; break;
      default: calories = tdee;
    }

    // Macro targets
    const protein = parseFloat(weight) * 2.2;
    const fat = calories * 0.25 / 9;
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4;

    const updatedData = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      weekly_budget: parseFloat(formData.weekly_budget) || 0,
      target_calories: Math.round(calories),
      target_protein: Math.round(protein),
      target_carbs: Math.round(carbs),
      target_fat: Math.round(fat)
    };

    try {
      await User.updateMyUserData(updatedData);
      toast.success("Profile updated successfully!");
      // Adding a small delay before navigating to allow user to see the toast.
      setTimeout(() => navigate(createPageUrl("Dashboard")), 1000);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-16 bg-slate-200 rounded-2xl w-1/3 mx-auto mb-6"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="p-4 md:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Profile
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Keep your information up to date to get the most accurate recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Edit Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Input id="weight" type="number" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                   <Select value={formData.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cutting">Cutting (lose weight)</SelectItem>
                      <SelectItem value="maintenance">Maintenance (maintain weight)</SelectItem>
                      <SelectItem value="bulking">Bulking (gain weight)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Weekly Food Budget ($)</Label>
                  <Input id="budget" type="number" value={formData.weekly_budget} onChange={(e) => handleInputChange('weekly_budget', e.target.value)} />
                </div>

                <Button 
                  onClick={calculateAndSaveChanges}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}