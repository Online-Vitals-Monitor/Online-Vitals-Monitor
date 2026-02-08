import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Heropage from "./Heropage";
import About from "./HowItWorks";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <Heropage />
      <About />
    </div>
  );
};

export default Homepage;
