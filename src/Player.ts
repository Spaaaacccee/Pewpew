import Asteroid from "./Asteroid";
import Bullet from "./Bullet";
import globalDebug from "./Debug";
import { Game } from "./Game";
import GameObject from "./GameObject";
import Input from "./Input";
import Spaceship, { EnemyShip, ISpaceshipOptions } from "./Spaceship";

export interface IPlayerOptions extends ISpaceshipOptions {
  maxHealth?: number;
  strength?: number;
}

export default class Player extends Spaceship {
  public playerOptions: IPlayerOptions = {};
  public health: number;

  constructor(game: Game, options: IPlayerOptions = {}) {
    super(game, { bulletType: PlayerBullet, collisionForceThreshold: 3, particleColor: 0xffffff, bulletColor: 0xffffff });
    this.playerOptions = {
      ...{ collisionForceThreshold: 3, maxHealth: 1000, strength: 10, bulletType: PlayerBullet },
      ...options
    };
    this.health = this.playerOptions.maxHealth || 1000;
    Input.whileKeyDown("d", this.rightThruster.bind(this));
    Input.whileKeyDown("a", this.leftThruster.bind(this));
    Input.onKeyDown("p", this.shoot.bind(this));
    globalDebug.writeEntry("PlayerHealth", this.health);
  }

  public onCollision(gameObject: GameObject, selfForce: number, gameObjectForce: number) {
    super.onCollision(gameObject, selfForce, gameObjectForce);
    if (gameObject instanceof Asteroid) {
      selfForce = selfForce * 0.2;
    }
    this.health = Math.max(this.health - Math.ceil(selfForce / (this.playerOptions.strength || 10)), 0);
    if (this.health === 0) {
      this.explode();
    }
    globalDebug.writeEntry("PlayerHealth", this.health);
  }

  public onBulletHit(bullet: Bullet, gameObject: GameObject, bulletForce: number, gameObjectForce: number) {
    this.health = Math.min(this.health + 100, this.playerOptions.maxHealth || 1000);
    globalDebug.writeEntry("PlayerHealth", this.health);
  }
}

export class PlayerBullet extends Bullet {
  public onCollision(gameObject: GameObject, selfForce: number, gameObjectForce: number) {
    super.onCollision(gameObject, selfForce, gameObjectForce);
    if (this.bulletOptions.parent instanceof Player && gameObject instanceof EnemyShip) {
      this.bulletOptions.parent.onBulletHit(this, gameObject, selfForce, gameObjectForce);
    }
  }
}
