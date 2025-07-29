import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    // Save user info (to state, context, or backend)
    // Redirect to profile page for more details
    navigate("/profile", { state: form });
  }

  return (
    <main className="landing-bg">
      <section className="landing-card">
        <h1 className="landing-title">Sign Up</h1>
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input name="name" type="text" placeholder="Name" required value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
          <input name="birthday" type="date" placeholder="Birthday" required value={form.birthday} onChange={handleChange} />
          <button className="landing-btn" type="submit">Create Account</button>
        </form>
      </section>
    </main>
  );
}