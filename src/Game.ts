import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import * as Seed from "seed-random";
import Asteroid from "./Asteroid";
import GameObject from "./GameObject";
import Input from "./Input";
import Options, { IViewportOptions } from "./Options";
import Player from "./Player";
import Utils from "./Utils";
import Viewport from "./Viewport";

// module aliases
const Engine = Matter.Engine;
const World = Matter.World;

export class Stage {
  public objects: GameObject[] = [];
  private physicsMap: WeakMap<Matter.Body, GameObject> = new WeakMap();
  private rendererMap: WeakMap<PIXI.DisplayObject, GameObject> = new WeakMap();
  public push(gameObject: GameObject): number {
    this.physicsMap.set(gameObject.body, gameObject);
    this.rendererMap.set(gameObject.graphics, gameObject);
    return this.objects.push(gameObject);
  }

  public remove(gameObject: GameObject) {
    this.physicsMap.delete(gameObject.body);
    this.rendererMap.delete(gameObject.graphics);
    this.objects = this.objects.filter(x => x !== gameObject);
  }

  public getFromBody(body: Matter.Body): GameObject | undefined {
    return this.physicsMap.get(body);
  }
  public getFromGraphics(graphics: PIXI.DisplayObject): GameObject | undefined {
    return this.rendererMap.get(graphics);
  }
}

export class Game {
  // create an engine
  public engine = Engine.create();
  public pixiRenderer: PIXI.Application;
  public pixiTicker: PIXI.ticker.Ticker;
  public stage: Stage = new Stage();
  public viewport: Viewport = new Viewport(
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth, y: window.innerHeight }
  );
  public viewportOptions: IViewportOptions = Options.viewport;

  public start(renderTarget: HTMLElement) {
    this.pixiRenderer = new PIXI.Application({
      antialias: true,
      backgroundColor: 0x100613,
      height: window.innerHeight,
      width: window.innerWidth
    });
    renderTarget.appendChild(this.pixiRenderer.view);

    this.pixiTicker = new PIXI.ticker.Ticker();

    Input.onKeyDown(
      "]",
      () => {
        this.viewportOptions.zoom = Math.min(
          (this.viewportOptions.zoom || 1) * 1.2,
          1.2 * (Options.viewport.maxZoomAmount || 1)
        );
      },
      true
    );
    Input.onKeyDown(
      "[",
      () => {
        this.viewportOptions.zoom = Math.max(
          (this.viewportOptions.zoom || 1) / 1.2,
          1.2 / (Options.viewport.maxZoomAmount || 1)
        );
      },
      true
    );

    this.pixiTicker.add(deltaTime => {
      if (this.viewportOptions.followTarget) {
        this.viewport.position = this.viewportOptions.positionUsesLerp
          ? Utils.lerpVector(this.viewport.position, this.viewportOptions.followTarget.body.position, deltaTime)
          : this.viewportOptions.followTarget.body.position;
        this.viewport.rotation = this.viewportOptions.matchRotation
          ? Utils.lerp(this.viewport.rotation, 0 - this.viewportOptions.followTarget.body.angle, deltaTime)
          : 0;
      }
      if (this.viewportOptions.zoom) {
        this.viewport.zoom = this.viewportOptions.zoomUsesLerp
          ? Utils.lerp(this.viewport.zoom, this.viewportOptions.zoom, deltaTime)
          : this.viewportOptions.zoom;
      }
      for (const gameObject of this.stage.objects) {
        gameObject.update(this.viewport);
      }
      this.pixiRenderer.render();
    });

    Input.startListening();

    this.engine.enableSleeping = true;
    this.engine.world.gravity = { x: 0, y: 0, scale: 0 };

    const player = new Player(this);
    this.viewportOptions.followTarget = player;
    this.viewportOptions.zoom = 1.2 / 3;
    this.addGameObject(player);

    const generator = Seed(Options.game.RNGSeed);
    for (let i = 0; i < 200; i++) {
      const box = new Asteroid(
        { x: generator() * 10000 - 5000, y: generator() * 10000 - 5000 },
        { rotation: generator() * (Math.PI / 2) }
      );
      this.addGameObject(box);
    }
    for (let i = 0; i < 200; i++) {
      const box = new Asteroid(
        { x: generator() * 10000 - 5000, y: generator() * 10000 - 5000 },
        { rotation: generator() * (Math.PI / 2), particles: 3 }
      );
      this.addGameObject(box);
    }
    for (let i = 0; i < 200; i++) {
      const box = new Asteroid(
        { x: generator() * 10000 - 5000, y: generator() * 10000 - 5000 },
        { rotation: generator() * (Math.PI / 2), particles: 4 }
      );
      this.addGameObject(box);
    }

    let lastFrameTime = Date.now();
    // run the engine
    const physicsLoop = () => {
      const frameTime = Date.now();
      Matter.Engine.update(this.engine, (frameTime - lastFrameTime) * (Options.game.simulationSpeedMultiplier || 1));
      lastFrameTime = frameTime;
      requestAnimationFrame(physicsLoop);
    };
    requestAnimationFrame(physicsLoop);
    this.pixiTicker.start();
  }

  public addGameObject(gameObject: GameObject): GameObject {
    if (!this.stage.objects.find(x => x === gameObject)) {
      gameObject.game = this;
      this.stage.push(gameObject);
      this.pixiRenderer.stage.addChild(gameObject.graphics);
      World.add(this.engine.world, gameObject.body);
    }
    return gameObject;
  }
  public removeGameObject(gameObject: GameObject): GameObject {
    if (this.stage.objects.find(x => x === gameObject)) {
      gameObject.game = undefined;
      World.remove(this.engine.world, gameObject.body);
      this.pixiRenderer.stage.removeChild(gameObject.graphics);
      this.stage.remove(gameObject);
    }
    return gameObject;
  }
}

export default new Game();
