import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <h1>How It Works</h1>
      <div className="explanation-container">
        <div className="step-card">
          <div className="step-number">01</div>
          <div className="step-content">
            <h3>Create or Join a Session</h3>
            <p>Start a new training session to get a unique Session ID, or henter an existing ID to connect devices to the same simulation environment.</p>
          </div>
        </div>        
        <div className="step-card">
          <div className="step-number">02</div>
          <div className="step-content">
            <h3>Configure Vitals & Presets</h3>
            <p>On the Controller page users can manually adjust values using sliders and adjustment buttons, or apply presets such as Shock, Hypoxia, or Increased ICP.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-number">03</div>
          <div className="step-content">
            <h3>Stream Real Time Waveforms</h3>
            <p>The dynamic system translates numeric values into visual waveforms in a clinical environment.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="step-number">04</div>
          <div className="step-content">
            <h3>Monitor and Respond</h3>
            <p>Users track the live monitor interface for changes. As instructors update conditions from the control page. Adjustments sync values across all connected session screens.</p>
          </div>
        </div>            
      </div>
    </div>
  );
};

export default HowItWorks;
