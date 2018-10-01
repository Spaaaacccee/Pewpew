import * as Matter from "matter-js";
import { Game } from "./Game";
import GameObject, { IGameObjectOptions, Rectangle } from "./GameObject";

export interface IBulletOptions extends IGameObjectOptions {
  collisionForceThreshold?: number;
  despawnAfter?: number;
  onCollision?: (gameObject: GameObject, selfForce: number, gameObjectForce: number) => void;
  parent?: GameObject;
}

export default class Bullet extends Rectangle {
  public bulletOptions: IBulletOptions;

  constructor(game: Game, position: Matter.Vector, size: Matter.Vector, options: IBulletOptions = {}) {
    super(position, size, options);
    this.bulletOptions = { ...{ despawnAfter: 5000, collisionForceThreshold: 3 }, ...options };
    Matter.Events.on(game.engine, "collisionStart", (e: Matter.IEventCollision<Matter.Body>) => {
      for (const pair of e.pairs) {
        const gameObjectA = game.stage.getFromBody(pair.bodyA);
        const gameObjectB = game.stage.getFromBody(pair.bodyB);
        const self = gameObjectA === this ? gameObjectA : gameObjectB === this ? gameObjectB : undefined;
        if (self && gameObjectA && gameObjectB) {
          const gameObject = self === gameObjectA ? gameObjectB : gameObjectA;
          const directionAB = Matter.Vector.normalise(Matter.Vector.sub(pair.bodyB.position, pair.bodyA.position));
          const relativeVelocity = Math.abs(
            Matter.Vector.dot(pair.bodyA.velocity, directionAB).valueOf() -
              Matter.Vector.dot(pair.bodyB.velocity, directionAB).valueOf()
          );
          this.onCollision(gameObject, this.body.mass * relativeVelocity, gameObject.body.mass * relativeVelocity);
          gameObject.onCollision(self, gameObject.body.mass * relativeVelocity, this.body.mass * relativeVelocity);
        }
      }
    });
    if (this.bulletOptions.despawnAfter) {
      setTimeout(() => {
        game.removeGameObject(this);
      }, this.bulletOptions.despawnAfter || 5000);
    }
  }
  public onCollision(gameObject: GameObject, selfForce: number, gameObjectForce: number) {
    super.onCollision(gameObject, selfForce, gameObjectForce);
    if (this.bulletOptions.onCollision) {
      this.bulletOptions.onCollision(gameObject, selfForce, gameObjectForce);
    }
  }
}
