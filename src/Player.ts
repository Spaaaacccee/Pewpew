
import { IBulletOptions } from "./Bullet";
import { Game } from "./Game";
import Input from "./Input";
import Spaceship from "./Spaceship";

// tslint:disable-next-line:no-empty-interface
export interface IPlayerOptions extends IBulletOptions {}

export default class Player extends Spaceship {
  public playerOptions: IPlayerOptions = {};

  constructor(game: Game, options: IPlayerOptions = {}) {
    super(game, options);
    this.playerOptions = {
      ...{ collisionVelocityThreshold: 3 },
      ...options
    };
    Input.whileKeyDown("d", this.rightThruster.bind(this));
    Input.whileKeyDown("a", this.leftThruster.bind(this));
    Input.onKeyDown("p", this.shoot.bind(this));
  }
}
