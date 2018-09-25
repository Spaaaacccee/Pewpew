import { Body, Vector } from "matter-js";
import { Particle, Rectangle } from "./GameObject";

export interface IAsteroidOptions {
  collisionForceThreshold?: number;
  size?: number;
  particles?: number;
  rotation?: number;
  explosionForce?: number;
  explosionTimeout?: number;
  minimumSize?: number;
  autoRemove?: boolean;
}

export default class Asteroid extends Rectangle {
  public particles: number;
  public size: number;
  public explosionForce: number;
  public canExplode: boolean;
  public minimumSize: number;
  public autoRemove: boolean;

  constructor(position: Vector, options: IAsteroidOptions = {}) {
    super(position, { x: options.size || 50, y: options.size || 50 }, { graphics: { color: 0x4d90ae } });
    Body.setAngle(this.body, options.rotation || 0)
    this.particles = options.particles || 2;
    this.size = options.size || 50;
    this.explosionForce = options.explosionForce || 0.0000005;
    setTimeout(() => {
      this.canExplode = true;
    }, options.explosionTimeout || 25);
    this.minimumSize = options.minimumSize || 6.25;
    this.autoRemove = options.autoRemove || true;
  }

  public explosionParticles() {
    if(this.game) {
    for(let i= 0;i<10;i++) {
      const particle = this.game.addGameObject(new Particle(this.localToWorldPosition({ x: this.size/2 * (Math.random()-0.5), y: this.size/2 * (Math.random()-0.5)}),{x:Math.min(this.size/2,12.5),y:Math.min(this.size/2,12.5)},{graphics:{color:0x4D90AE}}));
      Body.applyForce(particle.body,particle.body.position,Vector.rotate({x:0,y:0.005*Math.random()*Math.pow(this.size,2)*0.001},Math.random()*(Math.PI*2)));
      Body.setAngularVelocity(particle.body, Math.random()*0.01);
    }}
  }

  public explode() {
    if(this.game && this.canExplode && this.size <= this.minimumSize && this.autoRemove) {
      this.game.removeGameObject(this);
      this.explosionParticles();
    }
    if (this.game && this.canExplode && this.size > this.minimumSize) {
      for (let i = 0; i < this.particles; i++) {
        for (let j = 0; j < this.particles; j++) {
          const newAsteroid = this.game.addGameObject(
            new Asteroid(
              this.localToWorldPosition(
                Vector.sub(
                  {
                    x: (this.size / this.particles) * i + this.size / this.particles / 2,
                    y: (this.size / this.particles) * j + this.size / this.particles / 2
                  },
                  { x: this.size / 2, y: this.size / 2 }
                )
              ),
              { rotation: this.body.angle, size: this.size / this.particles }
            )
          );
          Body.applyForce(
            newAsteroid.body,
            newAsteroid.body.position,
            Vector.mult(Vector.normalise(Vector.sub(newAsteroid.body.position, this.body.position)), this.explosionForce*Math.pow(this.size,2))
          );
          Body.setAngularVelocity(newAsteroid.body, Math.random()*0.01);
        }
      }
      this.explosionParticles();
      this.game.removeGameObject(this);
    }
  }
}
