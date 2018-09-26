import GameObject from "./GameObject";

export interface IViewportOptions {
  followTarget?: GameObject;
  matchRotation?: boolean;
  positionUsesLerp?: boolean;
  rotationUsesLerp?: boolean;
  zoom?: number;
  zoomUsesLerp?: boolean;
  maxZoomAmount? : number;
}

export interface IGameOptions {
  RNGSeed?: string;
  simulationSpeedMultiplier? : number;
}

export default new class Options {
  public viewport : IViewportOptions = {
    matchRotation: true,
    maxZoomAmount: 10,
    positionUsesLerp: true,
    rotationUsesLerp: true,
    zoomUsesLerp: true
  };;
  public game : IGameOptions = {
    RNGSeed: "123456789",
    simulationSpeedMultiplier: 1
  };
}