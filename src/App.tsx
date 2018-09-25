import * as React from "react";
import "./App.css";
import Renderer from "./Renderer";

class App extends React.Component {

  public render() {
    return (
      <div className="App">
        <Renderer />
      </div>
    );
  }
}

export default App;
