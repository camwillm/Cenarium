// apps/web/src/entities/MealPlan.ts

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealFood {
  food_id: string;
  quantity: number; // in grams
}

export interface MealPlanItem {
  id?: string;
  date: string; // ISO date
  meal_type: MealType;
  foods: MealFood[];

  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_cost?: number;
  cost_per_calorie?: number;
  efficiency_score?: number;

  created_by?: string;
}

export const MealPlan = {
  async filter(params: {
    date: string;
    created_by: string;
  }): Promise<MealPlanItem[]> {
    // Mocked data - you would normally call your API here
    return [
      {
        id: "123",
        date: params.date,
        meal_type: "lunch",
        created_by: params.created_by,
        foods: [
          { food_id: "chicken123", quantity: 150 },
          { food_id: "rice456", quantity: 200 },
        ],
        total_calories: 700,
        total_protein: 50,
        total_carbs: 60,
        total_fat: 20,
        total_cost: 5.25,
        cost_per_calorie: 0.0075,
        efficiency_score: 8.4,
      },
    ];
  },
};
