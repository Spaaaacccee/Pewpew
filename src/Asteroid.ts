import { Body, Vector } from "matter-js";
import Bullet from "./Bullet";
import GameObject, { Particle, Rectangle } from "./GameObject";

export interface IAsteroidOptions {
  collisionForceThreshold?: number;
  size?: number;
  particles?: number;
  particleColor?: number;
  rotation?: number;
  explosionForce?: number;
  minimumSize?: number;
  autoRemove?: boolean;
  dieImmediately?: boolean;
  explosionEnableDelay?: number;
  extraParticleCount?: number;
}

export default class Asteroid extends Rectangle {
  public asteroidOptions: IAsteroidOptions = {};
  private canExplode: boolean = true;

  constructor(position: Vector, options: IAsteroidOptions = {}) {
    super(position, { x: options.size || 50, y: options.size || 50 }, { graphics: { color: 0x4d90ae } });
    Body.setAngle(this.body, options.rotation || 0);
    this.asteroidOptions = {
      ...{
        autoRemove: true,
        dieImmediately: false,
        explosionEnableDelay: 100,
        explosionForce: 0.0000005,
        extraParticleCount: 10,
        minimumSize: 6.25,
        particles: 2,
        size: 50
      },
      ...options
    };
    if (this.asteroidOptions.explosionEnableDelay) {
      this.canExplode = false;
      setTimeout(() => {
        this.canExplode = true;
      }, this.asteroidOptions.explosionEnableDelay);
    }
  }

  public explosionParticles() {
    if (this.game) {
      const size = this.asteroidOptions.size || 50;
      const particleColor = this.asteroidOptions.particleColor || 0x4d90ae;
      for (let i = 0; i < (this.asteroidOptions.extraParticleCount || 10); i++) {
        const particle = this.game.addGameObject(
          new Particle(
            this.localToWorldPosition({ x: (size / 2) * (Math.random() - 0.5), y: (size / 2) * (Math.random() - 0.5) }),
            { x: Math.max(size / 6, 6.25), y: Math.max(size / 6, 6.25) },
            { graphics: { color: particleColor } }
          )
        );
        Body.setVelocity(particle.body, this.body.velocity);
        Body.applyForce(
          particle.body,
          particle.body.position,
          Vector.rotate({ x: 0, y: 0.0001 * Math.random() * Math.pow(size, 2) * 0.002 }, Math.random() * (Math.PI * 2))
        );
        Body.setAngularVelocity(particle.body, (Math.random() - 0.5) * 0.5);
      }
    }
  }

  public onCollision = (gameObject: GameObject, selfForce: number, gameObjectForce: number) => {
    if (gameObject instanceof Bullet && selfForce >= (this.asteroidOptions.collisionForceThreshold || 1) && this.canExplode) {
      this.explode();
    }
  };

  public explode() {
    const size = this.asteroidOptions.size || 50;
    const autoRemove = this.asteroidOptions.autoRemove || true;
    const minimumSize = this.asteroidOptions.minimumSize || 6.25;
    const particles = this.asteroidOptions.particles || 2;
    const explosionForce = this.asteroidOptions.explosionForce || 0.0000005;
    const particleColor = this.asteroidOptions.particleColor || 0x4d90ae;
    if (this.canExplode && this.game && size <= minimumSize && autoRemove) {
      this.explosionParticles();
      this.game.removeGameObject(this);
    }
    if (this.canExplode && this.game && size > minimumSize) {
      for (let i = 0; i < particles; i++) {
        for (let j = 0; j < particles; j++) {
          const position = this.localToWorldPosition(
            Vector.sub(
              {
                x: (size / particles) * i + size / particles / 2,
                y: (size / particles) * j + size / particles / 2
              },
              { x: size / 2, y: size / 2 }
            )
          );
          const partition = this.game.addGameObject(
            this.asteroidOptions.dieImmediately
              ? new Particle(
                  position,
                  { x: size / particles, y: size / particles },
                  {
                    despawnAfter: 10000,
                    graphics: { color: particleColor },
                    physics: { angle: this.body.angle, density: 0.005 }
                  }
                )
              : new Asteroid(position, { rotation: this.body.angle, size: size / particles })
          );
          Body.setVelocity(partition.body, this.body.velocity);
          Body.applyForce(
            partition.body,
            partition.body.position,
            Vector.mult(
              Vector.normalise(Vector.sub(partition.body.position, this.body.position)),
              explosionForce * Math.pow(size, 2) + (Math.random() - 0.5) * 0.01
            )
          );
          Body.setAngularVelocity(partition.body, (Math.random() - 0.5) * 1);
        }
      }
      this.explosionParticles();
      this.game.removeGameObject(this);
    }
  }
}
