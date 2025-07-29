import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import MacroCalculator from "./components/MacroCalculator";
import AIMealSuggester from "./components/AIMealSuggester";
import Home from "./ppages/Home"; // Import your Home page
import About from "./ppages/About";
import Signup from "./ppages/Signup";
import Profile from "./ppages/Profile";

export default function App() {
  const navigate = useNavigate();
  return (
    <main className="landing-bg">
      <section className="landing-card">
        <h1 className="landing-title">Welcome to Cenarium</h1>
        <p className="landing-desc">
          Plan smarter. Eat better.<br />
          Track your meals and macros with real-time grocery costs and nutritional insights.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <button className="landing-btn" onClick={() => navigate("/signup")}>
            Get Started
          </button>
          <button className="landing-btn" onClick={() => navigate("/about")}>
            About
          </button>
        </div>
      </section>
    </main>
  );
}

export function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calculator" element={<MacroCalculator />} />
        <Route path="/suggest-meal" element={<AIMealSuggester />} />
      </Routes>
    </Router>
  );
}