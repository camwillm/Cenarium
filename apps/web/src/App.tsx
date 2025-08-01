import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { createPageUrl } from "@/utils";



function WrappedRoute({ element, title }: { element: JSX.Element; title: string }) {
  return <Layout currentPageName={title}>{element}</Layout>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page - no layout */}
        <Route path="/" element={<Landing />} />

        {/* Layout-wrapped routes */}
        <Route path={createPageUrl("Home")} element={<WrappedRoute title="Home" element={<Home />} />} />
        <Route path={createPageUrl("About")} element={<WrappedRoute title="About" element={<About />} />} />
        <Route path={createPageUrl("Signup")} element={<WrappedRoute title="Signup" element={<Signup />} />} />
        <Route path={createPageUrl("Profile")} element={<WrappedRoute title="Profile" element={<Profile />} />} />
        <Route path={createPageUrl("Calculator")} element={<WrappedRoute title="Calculator" element={<MacroCalculator />} />} />
        <Route path={createPageUrl("SuggestMeal")} element={<WrappedRoute title="SuggestMeal" element={<AIMealSuggester />} />} />
      </Routes>
    </Router>
  );
}
