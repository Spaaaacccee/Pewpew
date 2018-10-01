import { Vector } from "matter-js";
import GameObject from "./GameObject";
import Spaceship from "./Spaceship";
import Utils from "./Utils";

export interface IAIOptions {
  vehicle?: Spaceship;
  target?: GameObject;
  shootSpeed?: number;
}

export default class AI {
  public vehicle?: Spaceship;
  public target?: GameObject;
  public shootSpeed: number;
  private lastShootTime: number = 0;
  constructor(options: IAIOptions) {
    this.vehicle = options.vehicle;
    this.target = options.target;
    this.shootSpeed = options.shootSpeed || 500;
  }
  public drive() {
    if (this.vehicle && this.target) {
      const relTargetPosition = Vector.sub(this.target.body.position, this.vehicle.body.position);
      const relTargetDirection =
        0 - Vector.angle({ x: 0, y: 0 }, relTargetPosition) - Math.PI / 2 + (this.vehicle.body.angle % (Math.PI * 2));
      if (Utils.between(Math.abs(relTargetDirection), 0, 0.5)) {
        if(Utils.between(Math.abs(relTargetDirection),0,0.2)) {
          if (Vector.magnitude(relTargetPosition) < 2000) {
            const dateNow = Date.now();
            if (dateNow - this.lastShootTime >= this.shootSpeed) {
              this.vehicle.shoot();
              this.lastShootTime = dateNow;
            }
          }
        }
        if(Utils.between(this.vehicle.body.angularVelocity,-0.6,0.6)) {
          this.vehicle.leftThruster();
          this.vehicle.rightThruster();
        }
        if(this.vehicle.body.angularVelocity > 0.6) {
          this.vehicle.leftThruster();
        }
        if(this.vehicle.body.angularVelocity < -0.6) {
          this.vehicle.rightThruster();
        }
      } else {
        if (relTargetDirection > 0) {
          this.vehicle.rightThruster();
        } else {
          this.vehicle.leftThruster();
        }
      }
    }
  }
}
