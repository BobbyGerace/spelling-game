import { GameData } from "../../lib/game-data.js";
import { h } from "../../lib/h.js";

export class SelectGame extends HTMLElement {
  async connectedCallback() {
    this.renderTitle();
    this.renderMenu();

    this.loadPromise = GameData.preloadDataBank();
  }

  renderTitle() {
    this.titleAnim = h("sg-title-animation");

    this.appendChild(this.titleAnim);
  }

  renderMenu() {
    this.menu = h("div", { class: "select-game__menu" }, [
      h(
        "button",
        {
          class: "btn btn--primary",
          onclick: this.handleRandomGame.bind(this),
        },
        "Random Game",
      ),
      h(
        "button",
        {
          class: "btn",
        },
        "Select Letters",
      ),
    ]);

    this.appendChild(this.menu);
  }

  async handleRandomGame() {
    if (!GameData.finishedLoading()) {
      this.menu.remove();
      this.renderLoading();
      await this.loadPromise;
    }

    [...this.children].forEach((c) => this.removeChild(c));
    this.renderGame(GameData.randomGame());
  }

  renderLoading() {
    this.loading = h("div", { class: "select-game__loading" }, "Loading...");
    this.appendChild(this.loading);
  }

  loadComplete() {
    this.loading.style.display = "none";
    this.menu.style.display = "flex";
  }

  renderGame(gameData) {
    const game = h("sg-game");
    game.gameData = gameData;
    this.appendChild(game);
  }

  static register() {
    customElements.define("sg-select-game", SelectGame);
  }
}
