import { classes } from "../../lib/classes.js";
import { h } from "../../lib/h.js";

export class FoundWords extends HTMLElement {
  wordCount = 0;
  title = h("div", { class: "found-words__title" });

  connectedCallback() {
    this.render();
  }

  get totalWords() {
    return this.getAttribute("total-words");
  }

  render() {
    this.appendChild(this.title);
    this.update();
  }

  addWords(...args) {
    for (const arg of args) {
      const word = arg.toLowerCase();
      this.prepend(
        h(
          "span",
          {
            class: classes("found-words__word", {
              "found-words__word--pangram": this.isPangram(word),
            }),
          },
          word,
        ),
      );

      this.wordCount++;
    }

    this.update();
  }

  update() {
    const titleText = `Found words: ${this.wordCount} / ${this.totalWords}`;
    this.title.textContent = titleText;
  }

  isPangram(word) {
    return new Set(word.split("")).size === 7;
  }

  static register() {
    customElements.define("sg-found-words", FoundWords);
  }
}
