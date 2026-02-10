import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container-grid">
        <div className="footer-left-section">
          <div className="footer-logo-container">
            <img className="logo" src="vm-logo.png" />
          </div>
          <p className="footer-description">
            Developed as part of the Senior Capstone Project at Oregon State
            University. <br></br>Built for the purposes of medical practice and
            training.
          </p>
        </div>
        <div className="footer-right-section">
          <div className="footer-pages">
            <h1>PAGES</h1>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
            </ul>
          </div>
          <div className="footer-resources">
            <h1>RESOURCES</h1>
            <ul>
              <li>Licenses</li>
              <li>Report a Bug</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="copyright-section">
        <p>&copy; 2026 Vitals Monitor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
