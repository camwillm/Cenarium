import React from 'react';
import MacroCalculator from '../components/MacroCalculator';
import AIMealSuggester from '../components/AIMealSuggester';
import MacroCircles from '../components/MacroCircles';
import { Link } from 'react-router-dom';

const macroTargets = {
  calories: 2000,
  protein: 150,
  fat: 70,
  carbs: 250,
};

const Home: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Cenarium</h1>
      <nav>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <section style={{ marginBottom: "2rem" }}>
        <h2>Macro Circles</h2>
        <MacroCircles
          calories={1200}
          protein={80}
          fat={40}
          carbs={150}
          targets={macroTargets}
        />
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2>Macro Calculator</h2>
        <MacroCalculator />
      </section>
      <section>
        <h2>AI Meal Suggester</h2>
        <AIMealSuggester />
      </section>
    </div>
  );
};

export default Home;