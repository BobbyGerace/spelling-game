import { classes } from "../../lib/classes.js";
import { h } from "../../lib/h.js";

export class FoundWords extends HTMLElement {
  wordCount = 0;
  title = h("div", { class: "found-words__title" });
  container = h("div", { class: "found-words__container" });

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.toggleExpand);
  }

  disconnectedCallback() {}

  get totalWords() {
    return this.getAttribute("total-words");
  }

  render() {
    this.appendChild(this.title);
    this.appendChild(this.container);
    this.update();
  }

  addWords(...args) {
    for (const arg of args) {
      const word = arg.toLowerCase();
      this.container.prepend(
        h(
          "span",
          {
            class: classes("found-words__word", {
              "found-words__word--pangram": this.isPangram(word),
            }),
          },
          word + " ",
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

  toggleExpand() {
    this.container.classList.toggle("found-words__container--expanded");
  }

  isPangram(word) {
    return new Set(word.split("")).size === 7;
  }

  static register() {
    customElements.define("sg-found-words", FoundWords);
  }
}
