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

  static register() {
    customElements.define("sg-input-field", InputField);
  }
}
