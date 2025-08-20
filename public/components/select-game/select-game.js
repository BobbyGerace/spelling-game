import { h } from "../../lib/h.js";

export class SelectGame extends HTMLElement {
  connectedCallback() {
    this.renderMenu();
  }

  renderMenu() {
    this.appendChild(
      h("div", { class: "select-game__menu" }, [
        h(
          "button",
          {
            onclick: () => {
              [...this.children].forEach((c) => this.removeChild(c));
              this.renderGame();
            },
          },
          "Random Game",
        ),
        h("button", {}, "Select Letters"),
      ]),
    );
  }

  renderGame() {
    this.appendChild(h("sg-game", { letters: "OMNETIZ" }));
  }

  static register() {
    customElements.define("sg-select-game", SelectGame);
  }
}
