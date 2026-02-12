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
    this.scoreBar = h("sg-score-bar");
    this.scoreBar.model = this.model;
    this.appendChild(this.scoreBar);

    this.foundWords = h("sg-found-words", {
      "total-words": this.model.words.length,
    });
    this.foundWords.addWords(...this.model.foundWords);
    this.appendChild(this.foundWords);

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

  appendLetter(letter) {
    const accepted = this.model.inputLetter(letter);
    if (accepted) {
      this.inputField.appendLetter(letter);
    }
  }

  deleteLetter() {
    if (this.model.input.length > 0) {
      this.model.backspace();
      this.inputField.backspace();
    }
  }

  submitAnswer() {
    if (this.model.input.length === 0) return;

    const result = this.model.submit();

    if (result.success) {
      this.inputField.happyClear();
      this.foundWords.addWords(result.word);
      this.scoreBar.update();
    } else {
      this.inputField.sadClear();
    }

    this.notifier.showSubmitResult(result);
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
    document.body.addEventListener("keydown", this.handleKeydown);
  }

  unbindListeners() {
    this.letterButtons.removeEventListener(
      "letter-button-pressed",
      this.handleLetterButtonPress,
    );
    this.backButton.removeEventListener("click", this.handleBackButtonPress);
    this.deleteButton.removeEventListener("click", this.handleDeletePress);
    this.shuffleButton.removeEventListener("click", this.handleShufflePress);
    this.submitButton.removeEventListener("click", this.handleSubmitPress);
    document.body.removeEventListener("keydown", this.handleKeydown);
  }

  handleLetterButtonPress = (event) => {
    this.appendLetter(event.detail.letter);
  };

  handleBackButtonPress = () => {
    if (confirm("Abandon game and lose your progress?")) {
      this.model.abandonGame();
      this.dispatchEvent(new CustomEvent("leave-game"));
    }
  };

  handleDeletePress = () => {
    this.deleteLetter();
  };

  handleShufflePress = () => {
    this.letterButtons.shuffle();
  };

  handleSubmitPress = () => {
    this.submitAnswer();
  };

  handleKeydown = (event) => {
    const { key } = event;

    if (key.length === 1) {
      this.appendLetter(key.toUpperCase());
    } else if (key === "Backspace") {
      this.deleteLetter();
    } else if (key === "Enter") {
      this.submitAnswer();
    }
  };

  static register() {
    customElements.define("sg-game", Game);
  }
}
