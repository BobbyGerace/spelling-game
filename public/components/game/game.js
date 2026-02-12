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

  isWizardView() {
    return this.model.foundWords.length === this.model.words.length;
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

    this.playArea = h("div", { class: "game__play-area" });
    this.inputField = h("sg-input-field", {
      "central-letter": this.model.letters[0],
    });
    this.playArea.appendChild(this.inputField);

    this.notifier = h("sg-notifier");
    this.playArea.appendChild(this.notifier);

    this.letterButtons = h("sg-letter-buttons", {
      letters: this.model.letters,
    });
    this.playArea.appendChild(this.letterButtons);

    this.renderActionButtons();
    this.appendChild(this.playArea);

    this.wizardMessage = h("div", { class: "game__wizard-message" }, [
      h("span", { class: "game__wizard-message__text" }, "Yer a wizard, Harry"),
    ]);
    this.wizardMessage.hidden = true;
    this.appendChild(this.wizardMessage);

    this.backButton = h(
      "button",
      { class: "game__back-button", "aria-label": "Back" },
      "← leave game",
    );
    this.appendChild(this.backButton);

    this.updateWizardView();
  }

  renderActionButtons() {
    this.deleteButton = h("button", { class: "btn" }, "Delete");
    this.shuffleButton = h("button", { class: "btn" }, "⇄");
    this.submitButton = h("button", { class: "btn" }, "Submit");

    this.playArea.appendChild(
      h("div", { class: "game__action-buttons" }, [
        this.deleteButton,
        this.shuffleButton,
        this.submitButton,
      ]),
    );
  }

  updateWizardView() {
    const showWizard = this.isWizardView();
    this.playArea.hidden = showWizard;
    this.wizardMessage.hidden = !showWizard;
  }

  appendLetter(letter) {
    if (this.isWizardView()) return;
    const accepted = this.model.inputLetter(letter);
    if (accepted) {
      this.inputField.appendLetter(letter);
    }
  }

  deleteLetter() {
    if (this.isWizardView()) return;
    if (this.model.input.length > 0) {
      this.model.backspace();
      this.inputField.backspace();
    }
  }

  submitAnswer() {
    if (this.isWizardView()) return;
    if (this.model.input.length === 0) return;

    const result = this.model.submit();

    if (result.success) {
      this.inputField.happyClear();
      this.foundWords.addWords(result.word);
      this.scoreBar.update();
      this.updateWizardView();
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
    if (this.isWizardView()) return;
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
