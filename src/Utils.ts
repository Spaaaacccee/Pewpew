import { Vector } from "matter-js";

export default new class Utils {
  public lerp(from: number, to: number, deltaTime: number, amount: number = 0.1) {
    return from + deltaTime * amount * (to - from);
  }
  public lerpVector(from: Vector, to: Vector, deltaTime: number, amount: number = 0.1) {
    return Vector.add(from, Vector.mult(Vector.sub(to, from), deltaTime * amount));
  }
}();
