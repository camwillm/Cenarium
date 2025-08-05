// apps/web/src/entities/User.ts

export interface UserType {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  weekly_budget?: number;
  target_calories?: number;
  created_at?: string;
}

export const User = {
  async me(): Promise<UserType> {
    // Mocked user — replace with real API call
    return {
      id: "user_123",
      email: "example@domain.com",
      first_name: "Cam",
      last_name: "Williams",
      weekly_budget: 70,
      target_calories: 2800,
      created_at: new Date().toISOString(),
    };
  },
};
