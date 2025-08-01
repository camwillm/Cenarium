import axios from "axios";

export const getNutritionFacts = async (barcode: string) => {
  const response = await axios.get(`https://api.example.com/nutrition/${barcode}`);
  return response.data;
};
