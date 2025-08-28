import { classes } from "../../lib/classes.js";
import { h } from "../../lib/h.js";

export class InputField extends HTMLElement {
  letterSpans = [];

  get centralLetter() {
    return this.getAttribute("central-letter");
  }

  appendLetter(letter) {
    const span = h(
      "span",
      {
        class: classes("input-field__letter", {
          "input-field__letter--central": this.centralLetter === letter,
        }),
      },
      letter,
    );

    this.letterSpans.push(span);

    this.appendChild(span);
  }

  backspace() {
    this.children[this.children.length - 1].remove();
  }

  clear() {
    [...this.children].forEach((c) => c.remove());
  }

  happyClear() {
    const children = [...this.children];

    children.forEach((c, i) => {
      c.classList.add("input-field__letter--happy");
      c.style.animationDelay = `${i / 20}s`;
    });

    this.withTimeout(
      () => {
        children.forEach((c) => c.remove());
      },
      (children.length * 1000) / 20 + 1000,
    );
  }

  sadClear() {
    const children = [...this.children];

    children.forEach((c, i) => {
      c.classList.add("input-field__letter--sad");
    });

    this.withTimeout(() => {
      children.forEach((c) => c.remove());
    }, 2000);
  }

  withTimeout(fn, delay) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(fn, delay);
  }

  static register() {
    customElements.define("sg-input-field", InputField);
  }
}
