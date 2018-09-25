import * as Matter from "matter-js";
import Bullet, { IBulletOptions } from "./Bullet";
import { Game } from "./Game";
import { Particle } from "./GameObject";
import Input from "./Input";

export interface IPlayerOptions extends IBulletOptions {
  bulletForce?: number;
}

export default class Player extends Bullet {
  public playerOptions: IPlayerOptions = {};

  constructor(game: Game, options: IPlayerOptions = {}) {
    super(
      game,
      { x: (window.innerWidth - 50) / 2, y: 50 },
      { x: 50, y: 50 },
      { physics: { density: 0.01 }, collisionVelocityThreshold: options.collisionVelocityThreshold || 3, despawnAfter: 0 }
    );
    this.playerOptions = {
      ...{ collisionVelocityThreshold: 3 },
      ...options
    };
    Input.whileKeyDown("d", () => {
      Matter.Body.applyForce(
        this.body,
        this.localToWorldPosition({ x: 25, y: 25 }),
        Matter.Vector.rotate({ x: 0, y: -0.003 }, this.body.angle)
      );
      const particle = game.addGameObject(new Particle(this.localToWorldPosition({ x: 25+(Math.random()*10-5), y: 25+(Math.random()*5-2.5) }),{x:5,y:5}));
      Matter.Body.applyForce(particle.body,particle.body.position,Matter.Vector.rotate({x:0,y:0.0005*Math.random()},this.body.angle+(0.5*(Math.random()-0.5))));
      Matter.Body.setAngularVelocity(particle.body, Math.random()*0.01);
    });
    Input.whileKeyDown("a", () => {
      Matter.Body.applyForce(
        this.body,
        this.localToWorldPosition({ x: -25, y: 25 }),
        Matter.Vector.rotate({ x: 0, y: -0.003 }, this.body.angle)
      );
      const particle = game.addGameObject(new Particle(this.localToWorldPosition({ x: -25+(Math.random()*10-5), y: 25+(Math.random()*5-2.5) }),{x:5,y:5}));
      Matter.Body.applyForce(particle.body,particle.body.position,Matter.Vector.rotate({x:0,y:0.0005*Math.random()},this.body.angle+(0.5*(Math.random()-0.5))));
      Matter.Body.setAngularVelocity(particle.body, Math.random()*0.01);
    });
    Input.onKeyDown("p", () => {
      const bullet = game.addGameObject(
        new Bullet(game, this.localToWorldPosition({ x: 0, y: -25 }), { x: 10, y: 15 }, { physics: { angle: this.body.angle } })
      );
      Matter.Body.applyForce(
        bullet.body,
        bullet.body.position,
        Matter.Vector.mult(
          Matter.Vector.normalise(Matter.Vector.sub(this.localToWorldPosition({ x: 0, y: -75 }), this.body.position)),
          this.playerOptions.bulletForce || 0.01
        )
      );
    });
  }
}
