export class MealPlan {
  static async filter({ date, created_by }: { date: string; created_by: string }) {
    // TODO: Replace with actual fetch logic once backend is connected
    return [
      { total_calories: 600, total_cost: 5.25 },
      { total_calories: 750, total_cost: 6.80 }
    ];
  }
}
