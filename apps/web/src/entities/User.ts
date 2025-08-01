export class User {
  static async me() {
    // TODO: Replace with actual fetch logic once backend is connected
    return {
      email: "demo@example.com",
      first_name: "Demo",
      weekly_budget: 80,
      target_calories: 2200
    };
  }
}
