import * as Matter from "matter-js";
import AI from "./AI";
import Bullet, { IBulletOptions } from "./Bullet";
import { Game } from "./Game";
import GameObject, { Particle } from "./GameObject";

export interface ISpaceshipOptions extends IBulletOptions {
  bulletForce?: number;
  particleColor?: number;
  bulletColor?: number;
}

export default class Spaceship extends Bullet {
  public spaceshipOptions: ISpaceshipOptions = {};

  constructor(game: Game, options: ISpaceshipOptions = {}) {
    super(
      game,
      { x: (window.innerWidth - 50) / 2, y: 50 },
      { x: 50, y: 50 },
      {
        collisionVelocityThreshold: options.collisionVelocityThreshold || 3,
        despawnAfter: 0,
        graphics: options.graphics,
        physics: { ...{ density: 0.01 }, ...options.physics }
      }
    );
    this.spaceshipOptions = {
      ...{ collisionVelocityThreshold: 3 },
      ...options
    };
  }

  public leftThruster() {
    this.thruster(-25);
  }

  public rightThruster() {
    this.thruster(25);
  }

  public shoot() {
    if (this.game) {
      const bullet = this.game.addGameObject(
        new Bullet(
          this.game,
          this.localToWorldPosition({ x: 0, y: -25 }),
          { x: 10, y: 15 },
          { physics: { angle: this.body.angle }, graphics: { color: this.spaceshipOptions.bulletColor } }
        )
      );
      Matter.Body.applyForce(
        bullet.body,
        bullet.body.position,
        Matter.Vector.mult(
          Matter.Vector.normalise(Matter.Vector.sub(this.localToWorldPosition({ x: 0, y: -75 }), this.body.position)),
          this.spaceshipOptions.bulletForce || 0.01
        )
      );
    }
  }

  public explosionParticles() {
    if (this.game) {
      for (let i = 0; i < 35; i++) {
        const particle = this.game.addGameObject(
          new Particle(
            this.localToWorldPosition({ x: (Math.random()-0.5)*25, y: (Math.random()-0.5)*25 }),
            { x: 25, y: 25 },
            { graphics: { color: this.spaceshipOptions.particleColor } }
          )
        );
        Matter.Body.applyForce(
          particle.body,
          particle.body.position,
          Matter.Vector.add(Matter.Vector.rotate({ x: 0, y: 0.005 * Math.random()}, Math.random() * (Math.PI * 2)), Matter.Vector.mult(this.body.velocity,0.0002))
        );
        Matter.Body.setAngularVelocity(particle.body, Math.random() * 0.01);
      }
    }
  }

  public explode() {
    if (this.game) {
      this.explosionParticles();
      this.game.removeGameObject(this);
    }
  }

  private thruster(xPosition: number) {
    if (this.game) {
      Matter.Body.applyForce(
        this.body,
        this.localToWorldPosition({ x: xPosition, y: 25 }),
        Matter.Vector.rotate({ x: 0, y: -0.003 }, this.body.angle)
      );
      const particle = this.game.addGameObject(
        new Particle(
          this.localToWorldPosition({ x: xPosition + (Math.random() * 10 - 5), y: 25 + (Math.random() * 5 - 2.5) }),
          { x: 5, y: 5 },
          { physics: { angle: Math.random() * (Math.PI / 2) }, graphics: { color: this.spaceshipOptions.particleColor } }
        )
      );
      Matter.Body.applyForce(
        particle.body,
        particle.body.position,
        Matter.Vector.rotate({ x: 0, y: 0.0005 * Math.random() }, this.body.angle + 0.5 * (Math.random() - 0.5))
      );
      Matter.Body.setAngularVelocity(particle.body, Math.random() * 0.01);
    }
  }
}

export interface IEnemyShipOptions extends ISpaceshipOptions {
  target?: GameObject;
}

export class EnemyShip extends Spaceship {
  public driver: AI;
  constructor(game: Game, options: IEnemyShipOptions) {
    super(game, {
      ...{ graphics: { color: 0xe06c75 }, bulletColor: 0xe06c75, particleColor: 0xe06c75 },
      ...(options as ISpaceshipOptions)
    });
    this.driver = new AI({ target: options.target, vehicle: this });
  }
  public everyFrame(): void {
    this.driver.drive();
  }
}
