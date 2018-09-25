import { Vector } from "matter-js";

export default class Viewport {
  public position: Vector = { x: 0, y: 0 };

  public size: Vector = { x: 0, y: 0 };
  public rotation: number = 0;
  public zoom: number = 1;

  constructor(position: Vector, size: Vector, rotation: number = 0, zoom: number = 1) {
    this.position = position;
    this.size = size;
    this.rotation = rotation;
    this.zoom = zoom;
  }

  public worldToViewportPosition(position: Vector): Vector {
    return Vector.rotateAbout(
      Vector.add(Vector.mult(Vector.sub(position, this.position), this.zoom), Vector.mult(this.size, 0.5)),
      this.rotation,
      Vector.mult(this.size, 0.5)
    );
  }

  /**
   * Returns whether an object is in view.
   * @param position The position of the center of the object.
   * @param size The size of the object.
   */
  public isInViewport(position: Vector, size: Vector): boolean {
    const radius = Vector.mult(size, 0.5);
    const viewportRadius = Vector.mult(this.size, 0.5);
    const viewportPosition = this.worldToViewportPosition(position);

    const horizontally = this.between(viewportPosition.x, viewportRadius.x - radius.x, viewportRadius.x + radius.x);
    const vertically = this.between(viewportPosition.y, viewportRadius.y - radius.y, viewportRadius.y + radius.y);
    return horizontally && vertically;
  }

  private between(n: number, a: number, b: number, inclusive: boolean = true): boolean {
    const min = Math.min.apply(Math, [a, b]);
    const max = Math.max.apply(Math, [a, b]);
    return inclusive ? n >= min && n <= max : n > min && n < max;
  }
}
