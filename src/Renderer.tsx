import * as React from "react";
import Game from "./Game";

class Renderer extends React.Component {
  private renderer: HTMLElement;

  public componentDidMount() {
    Game.start(this.renderer);
  }

  public render() {
    return (
      <div style={{ width: "100%", height: "100%" }} id="main-canvas" ref={(e: HTMLDivElement) => (this.renderer = e)} />
    );
  }
}

export default Renderer;
