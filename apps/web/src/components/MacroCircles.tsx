import "./MacroCircles.scss";

type MacroCirclesProps = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  targets?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
  };
};

const macroColors: Record<string, string> = {
  calories: "#ff9800",
  protein: "#4caf50",
  fat: "#e91e63",
  carbs: "#2196f3",
};

function getPercent(value: number, target?: number) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

export default function MacroCircles({ calories, protein, fat, carbs, targets }: MacroCirclesProps) {
  const macros = [
    { key: "calories", value: calories, target: targets?.calories },
    { key: "protein", value: protein, target: targets?.protein },
    { key: "fat", value: fat, target: targets?.fat },
    { key: "carbs", value: carbs, target: targets?.carbs },
  ];

  return (
    <div className="macro-circles">
      {macros.map(({ key, value, target }) => {
        const percent = getPercent(value, target);
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - percent / 100);

        return (
          <div className={`circle ${key}`} key={key}>
            <svg width="70" height="70">
              <circle
                cx="35"
                cy="35"
                r={radius}
                stroke="#eee"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                stroke={macroColors[key]}
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s" }}
              />
            </svg>
            <span className="value">
              {value}
              {key !== "calories" ? "g" : ""}
              {target ? ` / ${target}${key !== "calories" ? "g" : ""}` : ""}
            </span>
            <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        );
      })}
    </div>
  );
}

// Example usage for testing: pass half of each target value
export function MacroCirclesTest() {
  const testTargets = {
    calories: 2000,
    protein: 150,
    fat: 70,
    carbs: 250,
  };

  return (
    <MacroCircles
      calories={testTargets.calories / 2}
      protein={testTargets.protein / 2}
      fat={testTargets.fat / 2}
      carbs={testTargets.carbs / 2}
      targets={testTargets}
    />
  );
}