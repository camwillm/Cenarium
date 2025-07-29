import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './MacroCalculator.scss';

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9,
};

function toCm(feet: number, inches: number) {
  return Math.round(feet * 30.48 + inches * 2.54);
}

function toKg(lbs: number) {
  return Math.round(lbs * 0.453592);
}

export default function MacroCalculator() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(8);
  const [lbs, setLbs] = useState(150);
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<number | null>(null);
  const [macros, setMacros] = useState<{protein: number, carbs: number, fat: number} | null>(null);
  const navigate = useNavigate();

  function calculate() {
    const height = toCm(feet, inches);
    const weight = toKg(lbs);
    let bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    let calories = bmr * activityFactors[activity as keyof typeof activityFactors];
    if (goal === 'lose') calories -= 500;
    if (goal === 'gain') calories += 500;
    calories = Math.round(calories);
    setResult(calories);

    const protein = Math.round((calories * 0.20) / 4); 
    const carbs = Math.round((calories * 0.50) / 4);   
    const fat = Math.round((calories * 0.30) / 9);     
    setMacros({ protein, carbs, fat });
  }

  return (
    <div className="macro-calculator">
      <h2>Macro/Calorie Calculator</h2>
      <label>Gender:
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <label>Age: <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} /></label>
      <label>
        Height: 
        <input type="number" value={feet} min={0} onChange={e => setFeet(Number(e.target.value))} style={{width: "40px"}} /> ft
        <input type="number" value={inches} min={0} max={11} onChange={e => setInches(Number(e.target.value))} style={{width: "40px", marginLeft: "8px"}} /> in
      </label>
      <label>
        Weight (lbs): <input type="number" value={lbs} onChange={e => setLbs(Number(e.target.value))} />
      </label>
      <label>Activity:
        <select value={activity} onChange={e => setActivity(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="extra">Extra Active</option>
        </select>
      </label>
      <label>Goal:
        <select value={goal} onChange={e => setGoal(e.target.value)}>
          <option value="lose">Lose Weight</option>
          <option value="maintain">Maintain</option>
          <option value="gain">Gain Weight</option>
        </select>
      </label>
      <button onClick={calculate}>Calculate</button>
      {result && macros && (
        <>
          <div>Recommended Calories per day: <b>{result}</b></div>
          <div>
            <b>Macros (grams/day):</b>
            <ul>
              <li>Protein: {macros.protein}g</li>
              <li>Carbs: {macros.carbs}g</li>
              <li>Fat: {macros.fat}g</li>
            </ul>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={() =>
                navigate("/suggest-meal", {
                  state: {
                    calories: result,
                    protein: macros.protein,
                    carbs: macros.carbs,
                    fat: macros.fat,
                  },
                })
              }
            >
              Suggest Meal Prep
            </button>
            <button
              onClick={() =>
                navigate("/profile", {
                  state: {
                    macros: {
                      calories: result,
                      protein: macros.protein,
                      carbs: macros.carbs,
                      fat: macros.fat,
                    },
                  }
                })
              }
            >
              Add to Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
