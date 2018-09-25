import "antd/dist/antd.min.css";
import * as React from "react";

class ControlsDisplay extends React.Component {
  public render() {
    const keyStyle: React.CSSProperties = {
      border: "1px solid white",
      borderRadius: 7,
      color: "white",
      display: "inline-block",
      fontSize: 18,
      fontWeight: "bold",
      height: 50,
      lineHeight: 2.7,
      margin: 20,
      width: 50,
    };
    const legendStyle: React.CSSProperties = {
      fontWeight: 400,
      marginRight: 20,
    }
    return (
      <div
        style={{
          background: "rgba(120,230,255,0.1)",
          borderRadius: 12,
          bottom: 20,
          color: "white",
          left: "50%",
          margin: "auto",
          opacity:0.7,
          position: "fixed",
          transform: "translateX(-50%)",
          width: 940,
        }}
      >
        <span style={keyStyle}>A</span>
        <span style={legendStyle}>for Left Thruster</span>
        <span style={keyStyle}>D</span>
        <span style={legendStyle}>for Right Thruster</span>
        <span style={keyStyle}>P</span>
        <span style={legendStyle}>for Pew</span>
        <span style={keyStyle}>[</span>
        <span style={legendStyle}>Zoom In</span>
        <span style={keyStyle}>]</span>
        <span style={legendStyle}>Zoom Out</span>
      </div>
    );
  }
}

export default ControlsDisplay;
