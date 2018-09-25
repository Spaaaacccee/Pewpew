import * as Matter from "matter-js";
import Asteroid from "./Asteroid";
import { Game } from "./Game";
import { IGameObjectOptions, Rectangle } from "./GameObject";

export interface IBulletOptions extends IGameObjectOptions {
  collisionVelocityThreshold?: number;
  despawnAfter?: number;
}

export default class Bullet extends Rectangle {
  public bulletOptions: IBulletOptions;
  constructor(game: Game, position: Matter.Vector, size: Matter.Vector, options: IBulletOptions = {}) {
    super(position, size, options);
    this.bulletOptions = { ...{ despawnAfter: 5000, collisionVelocityThreshold: 3 }, ...options };
    Matter.Events.on(game.engine, "collisionStart", (e: Matter.IEventCollision<Matter.Body>) => {
      for (const pair of e.pairs) {
        const directionAB = Matter.Vector.normalise(Matter.Vector.sub(pair.bodyB.position, pair.bodyA.position));
        const relativeVelocity = Math.abs(
          Matter.Vector.dot(pair.bodyA.velocity, directionAB).valueOf() -
            Matter.Vector.dot(pair.bodyB.velocity, directionAB).valueOf()
        );
        if ((this.bulletOptions.collisionVelocityThreshold || 3) <= relativeVelocity) {
          const gameObjects = [pair.bodyA, pair.bodyB].map(x => game.stage.getFromBody(x));
          if (gameObjects.filter(x => x instanceof Bullet).length === 1) {
            for (const gameObject of gameObjects) {
              if (gameObject instanceof Asteroid) {
                (gameObject as Asteroid).explode();
              }
            }
          }
        }
      }
    });
    if(this.bulletOptions.despawnAfter) {
      setTimeout(() => {
        game.removeGameObject(this);
      }, this.bulletOptions.despawnAfter || 5000);
    }
  }
}
