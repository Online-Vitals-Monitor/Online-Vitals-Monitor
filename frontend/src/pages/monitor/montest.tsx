import React from "react";

import "./montest.css";

const Montest = () => {
  return (
    <div className="grid-container">
      <div className="tracker">
        {/* Wave Area */}
        <div className="waves" style={{ gridArea: "wave-1" }}>
          Wave 1
        </div>

        {/* Nums Area (Now a Nested Grid!) */}
        <div className="nums" style={{ gridArea: "num-1" }}>
          {/* We give each piece of data a specific class so CSS knows where to put it */}
          <div className="num-title">NIBP mmHg</div>
          <div className="num-sys">120</div>
          <div className="num-slash">/</div>
          <div className="num-dia">80</div>
          <div className="num-map">(93)</div>
        </div>

        <div className="nums" style={{ gridArea: "num-2" }}>
          {/* We give each piece of data a specific class so CSS knows where to put it */}
          <div className="num-title">poop mmHg</div>
          <div className="num-sys">120</div>
          <div className="num-slash">/</div>
          <div className="num-dia">80</div>
          <div className="num-map">(93)</div>
        </div>
      </div>
    </div>
  );
};

export default Montest;
