import { Bodies, IChamferableBodyDefinition, Vector } from "matter-js";
import { Game } from "./Game";
import Viewport from "./Viewport";

export interface IGraphicsOptions {
  color?: number;
}

export interface IGameObjectOptions {
  graphics?: IGraphicsOptions;
  physics?: IChamferableBodyDefinition;
}

export default class GameObject {
  public body: Matter.Body;
  public graphics: PIXI.DisplayObject;
  public game?: Game;
  constructor(body: Matter.Body, graphics: PIXI.DisplayObject) {
    this.body = body;
    this.graphics = graphics;
  }
  public update(viewport: Viewport): void {
    const screenPosition = viewport.worldToViewportPosition(this.body.position);
    this.graphics.x = screenPosition.x;
    this.graphics.y = screenPosition.y;
    this.graphics.rotation = this.body.angle + viewport.rotation;
    this.graphics.scale = new PIXI.Point(viewport.zoom, viewport.zoom);
  }

  public localToWorldPosition(position: Vector): Vector {
    return Vector.add(this.body.position, Vector.rotate(position, this.body.angle));
  }
}

export class Rectangle extends GameObject {
  constructor(position: Vector = { x: 0, y: 0 }, size: Vector = { x: 0, y: 0 }, options: IGameObjectOptions = {}) {
    const g = new PIXI.Graphics();
    g.beginFill(options.graphics && options.graphics.color ? options.graphics.color : 0xffffff, 1);
    g.drawRect(0 - size.x / 2, 0 - size.y / 2, size.x, size.y);
    g.x = position.x;
    g.y = position.y;
    super(Bodies.rectangle(position.x, position.y, size.x, size.y, options.physics), g);
  }
}

export interface IParticleOptions extends IGameObjectOptions {
  despawnAfter?: number;
  opacity?: number;
}

export class Particle extends Rectangle {
  public particleOptions: IParticleOptions;
  public timeOfCreation: number;

  constructor(position: Vector = { x: 0, y: 0 }, size: Vector = { x: 0, y: 0 }, options: IParticleOptions = {}) {
    super(position, size, options);
    this.body.collisionFilter.group = -1;
    this.body.collisionFilter.mask = 0;
    this.graphics.alpha = options.opacity || 1;
    setTimeout(() => {
      if (this.game) {
        this.game.removeGameObject(this);
      }
    }, options.despawnAfter || 2500);
    this.timeOfCreation = Date.now();
    this.particleOptions = options;
  }
  public update(viewport: Viewport): void {
    this.graphics.alpha = Math.max(
      1 - (1 * (Date.now() - this.timeOfCreation)) / (this.particleOptions.despawnAfter || 2500),
      0
    );
    super.update(viewport);
  }
}
