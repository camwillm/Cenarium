import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AIMealSuggester.scss";

export default function AIMealSuggester() {
  const location = useLocation();
  const macroTargets = location.state || {};

  const [itemsData, setItemsData] = useState<any>(null);
  const [meal, setMeal] = useState<any>(null);

  useEffect(() => {
    fetch("/all-items.json")
      .then((res) => res.json())
      .then(setItemsData);
  }, []);

  function getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function suggestMeal() {
    if (!itemsData) return;
    const categories = Object.keys(itemsData);
    const selected: any[] = [];
    let total = { calories: 0, protein: 0, fat: 0, carbs: 0, price: 0 };

    categories.forEach((cat) => {
      const arr = itemsData[cat];
      if (arr && arr.length) {
        const item = getRandomItem(arr);
        selected.push(item);
        total.calories += item.nutrition.calories;
        total.protein += item.nutrition.protein_g;
        total.fat += item.nutrition.fat_g;
        total.carbs += item.nutrition.carbs_g;
        total.price += item.price_per_serving;
      }
    });

    setMeal({ items: selected, total });
  }

  return (
    <div className="ai-meal-suggester">
      <h2>AI Meal Suggester</h2>
      <div className="results">
        <h3>Your Macro Targets:</h3>
        <ul>
          <li>Calories: {macroTargets.calories}</li>
          <li>Protein: {macroTargets.protein}g</li>
          <li>Carbs: {macroTargets.carbs}g</li>
          <li>Fat: {macroTargets.fat}g</li>
        </ul>
      </div>
      <button onClick={suggestMeal}>Suggest Meal</button>
      {meal && (
        <div className="results">
          <h3>Suggested Meal:</h3>
          <ul>
            {meal.items.map((item: any) => (
              <li key={item.item_id}>
                {item.name} ({item.category})
              </li>
            ))}
          </ul>
          <div>
            <b>Totals:</b>
            <ul>
              <li>Calories: {meal.total.calories}</li>
              <li>Protein: {meal.total.protein}g</li>
              <li>Fat: {meal.total.fat}g</li>
              <li>Carbs: {meal.total.carbs}g</li>
              <li>Price: ${meal.total.price.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}