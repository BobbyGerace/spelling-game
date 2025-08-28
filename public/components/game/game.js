import { h } from "../../lib/h.js";

export class Game extends HTMLElement {
  connectedCallback() {
    if (!this.model) {
      throw new Error("Game connected with no model");
    }

    this.render();
    this.bindListeners();
  }

  disconnectedCallback() {
    this.unbindListeners();
  }

  render() {
    this.inputField = h("sg-input-field", {
      "central-letter": this.model.letters[0],
    });
    this.appendChild(this.inputField);

    this.notifier = h("sg-notifier");
    this.appendChild(this.notifier);

    this.letterButtons = h("sg-letter-buttons", {
      letters: this.model.letters,
    });
    this.appendChild(this.letterButtons);

    this.renderActionButtons();

    this.backButton = h(
      "button",
      { class: "game__back-button", "aria-label": "Back" },
      "← leave game",
    );
    this.appendChild(this.backButton);
  }

  renderActionButtons() {
    this.deleteButton = h("button", { class: "btn" }, "Delete");
    this.shuffleButton = h("button", { class: "btn" }, "⇄");
    this.submitButton = h("button", { class: "btn" }, "Submit");

    this.appendChild(
      h("div", { class: "game__action-buttons" }, [
        this.deleteButton,
        this.shuffleButton,
        this.submitButton,
      ]),
    );
  }

  bindListeners() {
    this.letterButtons.addEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
    this.backButton.addEventListener("click", this.handleBackButtonPress);
    this.deleteButton.addEventListener("click", this.handleDeletePress);
    this.shuffleButton.addEventListener("click", this.handleShufflePress);
    this.submitButton.addEventListener("click", this.handleSubmitPress);
  }

  unbindListeners() {
    this.letterButtons.removeEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
    this.backButton.removeEventListener("click", this.handleBackButtonPress);
    this.deleteButton.removeEventListener("click", this.handleDeletePress);
    this.shuffleButton.removeEventListener("click", this.handleShufflePress);
    this.submitButton.addEventListener("click", this.handleSubmitPress);
  }

  handleLetterButtonPress = (event) => {
    const letter = event.detail.letter;
    const accepted = this.model.inputLetter(letter);
    if (accepted) {
      this.inputField.appendLetter(letter);
    }
  };

  handleBackButtonPress = () => {
    if (confirm("Abandon game and lose your progress?")) {
      this.model.abandonGame();
      this.dispatchEvent(new CustomEvent("leave-game"));
    }
  };

  handleDeletePress = () => {
    if (this.model.input.length > 0) {
      this.model.backspace();
      this.inputField.backspace();
    }
  };

  handleShufflePress = () => {
    this.letterButtons.shuffle();
  };

  handleSubmitPress = () => {
    const result = this.model.submit();

    if (result.success) {
      this.inputField.happyClear();
    } else {
      this.inputField.sadClear();
    }

    this.notifier.showSubmitResult(result);
  };

  static register() {
    customElements.define("sg-game", Game);
  }
}
