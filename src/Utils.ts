import { Vector } from "matter-js";

export default new class Utils {
  public noop() {
    return undefined;
  }
  public between(n: number, a: number, b: number, inclusive: boolean = true): boolean {
    const min = Math.min.apply(Math, [a, b]);
    const max = Math.max.apply(Math, [a, b]);
    return inclusive ? n >= min && n <= max : n > min && n < max;
  }
  public lerp(from: number, to: number, deltaTime: number, amount: number = 0.1) {
    return from + deltaTime * amount * (to - from);
  }
  public lerpVector(from: Vector, to: Vector, deltaTime: number, amount: number = 0.1) {
    return Vector.add(from, Vector.mult(Vector.sub(to, from), deltaTime * amount));
  }
}();
