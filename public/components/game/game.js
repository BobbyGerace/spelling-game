import { h } from "../../lib/h.js";
import { Model } from "../../model.js";

export class Game extends HTMLElement {
  connectedCallback() {
    if (!this.gameData) {
      throw new Error("Game connected with no data");
    }

    this.model = new Model(this.gameData);

    this.render();
    this.bindListeners();
  }

  render() {
    this.inputField = h("sg-input-field", {
      "central-letter": this.gameData.letters[0],
    });
    this.appendChild(this.inputField);

    this.letterButtons = h("sg-letter-buttons", {
      letters: this.gameData.letters,
    });
    this.appendChild(this.letterButtons);
  }

  bindListeners() {
    this.letterButtons.addEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
  }

  handleLetterButtonPress = (event) => {
    const letter = event.detail.letter;
    const accepted = this.model.inputLetter(letter);
    if (accepted) {
      this.inputField.appendLetter(letter);
    }
  };

  static register() {
    customElements.define("sg-game", Game);
  }
}
