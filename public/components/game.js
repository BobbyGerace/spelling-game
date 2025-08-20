import { h } from "../../lib/h.js";
import { Model } from "../model.js";

export class Game extends HTMLElement {
  connectedCallback() {
    this.letters = this.getAttribute("letters");
    this.model = new Model(this.letters);

    this.render();
    this.bindListeners();
  }

  render() {
    this.input = h("div", { class: "game__input" });
    this.appendChild(this.input);

    this.letterButtons = h("sg-letter-buttons", { letters: this.letters });
    this.appendChild(this.letterButtons);
  }

  bindListeners() {
    this.letterButtons.addEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
  }

  handleLetterButtonPress = (event) => {
    this.model.inputLetter(event.detail.letter);
    this.input.textContent = this.model.input;
  };

  static register() {
    customElements.define("sg-game", Game);
  }
}
