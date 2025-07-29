import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state || {};
  const [profile, setProfile] = useState({
    name: initial.name || "",
    email: initial.email || "",
    birthday: initial.birthday || "",
    gender: "",
    activity: "",
    goal: "",
    allergies: "",
    diet: "",
    macros: initial.macros || null,
  });

  useEffect(() => {
    if (location.state && location.state.macros) {
      setProfile((prev) => ({ ...prev, macros: location.state.macros }));
    }
  }, [location.state]);

  const needsMacros =
    !profile.macros ||
    !profile.macros.calories ||
    !profile.macros.protein ||
    !profile.macros.carbs ||
    !profile.macros.fat;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function handleGoToCalculator() {
    navigate("/calculator", { state: profile });
  }

  return (
    <main className="landing-bg">
      <section className="landing-card">
        <h1 className="landing-title">Your Profile</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input name="name" type="text" placeholder="Name" value={profile.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={profile.email} onChange={handleChange} />
          <input name="birthday" type="date" placeholder="Birthday" value={profile.birthday} onChange={handleChange} />
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select name="activity" value={profile.activity} onChange={handleChange}>
            <option value="">Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="extra">Extra Active</option>
          </select>
          <select name="goal" value={profile.goal} onChange={handleChange}>
            <option value="">Nutrition Goal</option>
            <option value="maintain">Maintain</option>
            <option value="lose">Lose Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
          <input name="allergies" type="text" placeholder="Allergies (comma separated)" value={profile.allergies} onChange={handleChange} />
          <input name="diet" type="text" placeholder="Diet Preferences (e.g. vegetarian, keto)" value={profile.diet} onChange={handleChange} />
        </form>
        {needsMacros && (
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="landing-btn" onClick={handleGoToCalculator}>
              Run Macro Calculator
            </button>
            <button
              className="landing-btn"
              disabled
              style={{ background: "#ccc", color: "#888", cursor: "not-allowed" }}
            >
              Save Macros to Suggest Meals
            </button>
          </div>
        )}
        {!needsMacros && (
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="landing-btn" onClick={handleGoToCalculator}>
              Run Macro Calculator
            </button>
            <button
              className="landing-btn"
              onClick={() => navigate("/suggest-meal", { state: profile.macros })}
            >
              Suggest Meals
            </button>
          </div>
        )}
        {profile.macros && (
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#0078d4", marginBottom: "1rem" }}>
              Saved Macros
            </h2>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              fontSize: "1.15rem",
              fontWeight: "600",
              marginBottom: "1rem"
            }}>
              <span>Calories: {profile.macros.calories}</span>
              <span>Protein: {profile.macros.protein}g</span>
              <span>Carbs: {profile.macros.carbs}g</span>
              <span>Fat: {profile.macros.fat}g</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;