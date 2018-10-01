import { Bodies, IChamferableBodyDefinition, Vector } from "matter-js";
import { Game } from "./Game";
import Utils from "./Utils";
import Viewport from "./Viewport";

export interface IGraphicsOptions {
  color?: number;
}

export interface IGameObjectOptions {
  graphics?: IGraphicsOptions;
  physics?: IChamferableBodyDefinition;
}

export default class GameObject {
  public everyFrame: () => void = Utils.noop;
  public firstFrame: () => void = Utils.noop;

  public body: Matter.Body;
  public graphics: PIXI.DisplayObject;
  public game?: Game;

  private started: boolean = false;

  constructor(body: Matter.Body, graphics: PIXI.DisplayObject) {
    this.body = body;
    this.graphics = graphics;
  }

  public onCollision(gameObject: GameObject, selfForce: number, gameObjectForce: number) {
    return;
  }

  public start() {
    this.started = true;
    this.firstFrame();
    if (this.everyFrame !== Utils.noop) {
      const updateLoop = () => {
        this.everyFrame();
        if (this.started) {
          requestAnimationFrame(updateLoop);
        }
      };
      requestAnimationFrame(updateLoop);
    }
  }

  public stop() {
    this.started = false;
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
  despawnTimeRandomness?: number;
}

export class Particle extends Rectangle {
  public particleOptions: IParticleOptions;
  public timeOfCreation: number;
  public despawnAfter: number;

  constructor(position: Vector = { x: 0, y: 0 }, size: Vector = { x: 0, y: 0 }, options: IParticleOptions = {}) {
    super(position, size, options);
    this.body.collisionFilter.group = -1;
    this.body.collisionFilter.mask = 0;
    this.graphics.alpha = options.opacity || 1;
    this.despawnAfter = (options.despawnAfter || 2500) + (Math.random() - 0.5) * (options.despawnTimeRandomness || 1000);
    setTimeout(() => {
      if (this.game) {
        this.game.removeGameObject(this);
      }
    }, this.despawnAfter);
    this.timeOfCreation = Date.now();
    this.particleOptions = options;
  }
  public update(viewport: Viewport): void {
    this.graphics.alpha = Math.max(1 - (1 * (Date.now() - this.timeOfCreation)) / this.despawnAfter, 0);
    super.update(viewport);
  }
}
