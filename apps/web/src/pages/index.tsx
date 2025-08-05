import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Calculator from "./Calculator";
import Foods from "./Foods";
import Profile from "./Profile";

// Define a type-safe map of page components
const PAGES = {
  Dashboard,
  Calculator,
  Foods,
  Profile
};

// Type for the PAGES keys
type PageName = keyof typeof PAGES;

// Determine current page name from the URL
function getCurrentPage(url: string): PageName {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  let urlLastPart = url.split("/").pop() || "";
  if (urlLastPart.includes("?")) {
    urlLastPart = urlLastPart.split("?")[0];
  }

  const page = Object.keys(PAGES).find(
    (key) => key.toLowerCase() === urlLastPart.toLowerCase()
  );

  return (page as PageName) || "Dashboard";
}

// Component that gets current page and renders the layout + routing
function PagesContent() {
  const location = useLocation();
  const currentPage = getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/Foods" element={<Foods />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

// Root component with Router context
export default function Pages(): JSX.Element {
  return (
    <Router>
      <PagesContent />
    </Router>
  );
}
