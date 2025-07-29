const About: React.FC = () => (
  <main className="landing-bg">
    <section className="landing-card">
      <h1 className="landing-title">About Cenarium</h1>
      <p className="landing-desc">
        <b>Cenarium</b> is a nutrition and meal planning app designed to make it easier to understand what you eat and how much it costs. The app helps you plan meals, calculate macros and calories, and see real grocery prices for the foods you choose.<br /><br />
        <b>Features:</b>
        <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: "400px" }}>
          <li>Macro and calorie calculator</li>
          <li>AI-powered meal suggestions</li>
          <li>Real-time grocery price integration</li>
          <li>Progress circles for tracking nutrition</li>
        </ul>
        <br />
        <b>About the Creator:</b><br />
        My name is <b>Cameron</b>. I built Cenarium because I wanted a tool that shows not just nutrition information, but also the actual cost of eating well. I think most nutrition apps ignore price, and I wanted to make that clear and accessible. This project is my way of combining practical data and simple tools so anyone can make informed choices about their food. If you have feedback or want to help improve Cenarium, you can reach out or contribute on GitHub.
      </p>
      <button className="landing-btn" onClick={() => window.history.back()}>
        Back
      </button>
    </section>
  </main>
);

export default About;