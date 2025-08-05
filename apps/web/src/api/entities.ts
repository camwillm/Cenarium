// src/api/entities.ts

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category:
    | "protein"
    | "carbs"
    | "vegetables"
    | "fruits"
    | "dairy"
    | "grains"
    | "snacks"
    | "beverages"
    | "condiments"
    | "other";
  serving_size: number;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  sodium_per_100g?: number;
  fiber_per_100g?: number;
  price_per_unit?: number;
  unit_weight?: number;
  store?: string;
  last_price_update?: string;
}

export const Food = {
  async list(orderBy: string = ""): Promise<FoodItem[]> {
    // You can replace this mock with a real API call later
    return [
      {
        id: "1",
        name: "Chicken Breast",
        brand: "Tyson",
        category: "protein",
        serving_size: 100,
        calories_per_100g: 165,
        protein_per_100g: 31,
        carbs_per_100g: 0,
        fat_per_100g: 3.6,
        sodium_per_100g: 70,
        fiber_per_100g: 0,
        price_per_unit: 8.99,
        unit_weight: 1000,
        store: "Walmart",
        last_price_update: "2025-08-01",
      },
      // Add more sample data as needed
    ];
  },
};
