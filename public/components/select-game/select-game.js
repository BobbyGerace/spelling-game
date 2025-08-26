import { GameData } from "../../lib/game-data.js";
import { h } from "../../lib/h.js";
import { Model } from "../../model.js";

export class SelectGame extends HTMLElement {
  async connectedCallback() {
    const existingGameModel = Model.fromStorage();

    if (!existingGameModel) {
      this.showStartScreen();
    } else {
      this.startGame(existingGameModel);
    }
  }

  showStartScreen() {
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
    const gameData = GameData.randomGame();
    this.startGame(new Model(gameData.letters, gameData.wordList));
  }

  renderLoading() {
    this.loading = h("div", { class: "select-game__loading" }, "Loading...");
    this.appendChild(this.loading);
  }

  loadComplete() {
    this.loading.style.display = "none";
    this.menu.style.display = "flex";
  }

  startGame(model) {
    const game = h("sg-game");
    game.model = model;
    this.appendChild(game);

    const leaveListener = () => {
      game.removeEventListener("leave-game", leaveListener);
      game.remove();
      this.showStartScreen();
    };

    game.addEventListener("leave-game", leaveListener);
  }

  static register() {
    customElements.define("sg-select-game", SelectGame);
  }
}
