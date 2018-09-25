import * as React from "react";
import "./App.css";
import ControlsDisplay from "./ControlsDisplay";
import Renderer from "./Renderer";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Renderer />
        <ControlsDisplay />
        <div
          style={{
            boxShadow: "inset 0 0 15em 1em #000",
            height: "100%",
            position: "fixed",
            top:0,
            width: "100%",
          }}
        />
      </div>
    );
  }
}

export default App;
