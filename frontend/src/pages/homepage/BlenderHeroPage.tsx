import React from "react";
import "./BlenderHeroPage.css";

const BlenderHeroPage = () => {
  return (
    <div className="hero-img-wrap">
      <div
        className="hero-img"
        style={{
          backgroundImage: "url('/images/vitals-heropage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default BlenderHeroPage;
