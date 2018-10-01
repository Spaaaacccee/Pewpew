class Debug {
  public entries: { [s: string]: number } = {};
  public isVisible: boolean = false;
  private target: HTMLElement | null;

  constructor() {
    this.target = document.getElementById("debug");
    this.hide();
  }

  public update() {
    if (this.target) {
      const target = this.target;
      this.target.innerHTML = "";
      Object.keys(this.entries).forEach(val => {
        target.innerHTML += `<p>${val}: ${this.entries[val]}</p>`;
      });
    }
  }

  public show() {
    if (this.target) {
      this.target.style.display = "block";
      this.isVisible = true;
    }
  }

  public hide() {
    if (this.target) {
      this.target.style.display = "none";
      this.isVisible = false;
    }
  }

  public writeEntry(key: string, value: number) {
    this.entries[key] = value;
    this.update();
  }
}

const globalDebug = new Debug();

export default globalDebug;

export class FPSCounter {
  public count = 0;
  constructor(name: string) {
    setInterval(() => {
      globalDebug.writeEntry(name, this.count);
      this.count = 0;
    }, 1000);
  }
  public addCount(amount: number = 1) {
    this.count += amount;
  }
}
