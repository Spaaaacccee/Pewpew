interface IKeyDownListener {
  key: string;
  callback: () => void;
}

interface IKeyDownOnceListener extends IKeyDownListener {
  repeat: boolean;
}

export default new class Input {
  private whileKeyDownListeners: IKeyDownListener[] = [];
  private onKeyDownListeners: IKeyDownOnceListener[] = [];
  private keyDown = {};

  public startListening() {
    document.body.addEventListener("keydown", e => {
      for (const listener of this.onKeyDownListeners) {
        if (e.key === listener.key) {
          if (e.repeat && !listener.repeat) {
            return;
          }
          listener.callback();
        }
      }
      this.keyDown[e.key] = true;
    });
    document.body.addEventListener("keyup", e => {
      this.keyDown[e.key] = false;
    });
    const it = () => {
      for (const listener of this.whileKeyDownListeners) {
        if (this.keyDown[listener.key]) {
          listener.callback();
        }
      }
      requestAnimationFrame(it);
    };
    requestAnimationFrame(it);
  }
  public whileKeyDown(key: string, callback: () => void) {
    this.whileKeyDownListeners.push({ key, callback });
  }

  public onKeyDown(key: string, callback: () => void, repeat: boolean = false) {
    this.onKeyDownListeners.push({ key, callback, repeat });
  }

  public removeOnKeyDown(key: string, callback: () => void, repeat: boolean) {
    this.onKeyDownListeners = this.onKeyDownListeners.filter(
      item => !(item.key === key && item.callback === callback && !!repeat === !!item.repeat)
    );
  }

  public removeWhileKeyDown(key: string, callback: () => void) {
    this.whileKeyDownListeners = this.whileKeyDownListeners.filter(item => !(item.key === key && item.callback === callback));
  }
}();
