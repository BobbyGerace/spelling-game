import { h } from "../../lib/h.js";
import { Model } from "../model.js";

export class Game extends HTMLElement {
  connectedCallback() {
    this.letters = this.getAttribute("letters");
    this.model = new Model(this.letters);

    this.render();
    this.bindEvents();
  }

  render() {
    this.input = h("div", { class: "game__input" });
    this.appendChild(this.input);

    this.letterButtons = h("sg-letter-buttons", { letters: this.letters });
    this.appendChild(this.letterButtons);
  }

  bindEvents() {
    this.addEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
  }

  handleLetterButtonPress = (event) => {
    this.model.inputLetter(event.detail.letter);
  };

  static register() {
    customElements.define("sg-game", Game);
  }
}
