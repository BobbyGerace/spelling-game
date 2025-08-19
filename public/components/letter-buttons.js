import { hs } from "../lib/h.js";
import { classes } from "../lib/classes.js";

const R = 20;
const GAP = 3;

export class LetterButtons extends HTMLElement {
  cells = [];
  texts = [];

  connectedCallback() {
    this.drawSvg();
  }

  static get observedAttributes() {
    return ["letters"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "letters") {
      this.letters = newValue.split("");
    }

    this.update();
  }

  update() {
    this.texts.forEach((text, i) => (text.textContent = this.letters[i]));
  }

  drawSvg() {
    const coords = this.hexCenters();

    this.cells = this.drawCells(coords);

    this.texts = this.drawLetters(coords, this.letters);

    this.svg = hs(
      "svg",
      {
        viewBox: "-100 -100 200 200",
        class: "letter-buttons",
      },
      [...this.cells, ...this.texts],
    );

    this.appendChild(this.svg);
  }

  hexCenters() {
    const startAngle = Math.PI / 2;
    const coords = [[0, 0]];

    for (let i = 0; i < 6; i++) {
      const angle = startAngle + (i * Math.PI) / 3;
      const x = Math.cos(angle) * (R * Math.sqrt(3) + GAP);
      const y = Math.sin(angle) * (R * Math.sqrt(3) + GAP);

      coords.push([x, y]);
    }

    return coords;
  }

  drawLetters(coords, letters) {
    return coords.map(([x, y], i) =>
      hs(
        "text",
        {
          x,
          y,
          "text-anchor": "middle",
          "dominant-baseline": "central",
          class: classes("letter-buttons__letter", {
            "letter-buttons__letter--central": i === 0,
          }),
        },
        letters[i],
      ),
    );
  }

  drawCells(coords) {
    return coords.map(([x, y], i) => this.drawHexagon(x, y, i));
  }

  drawHexagon(cx, cy, i) {
    const self = this;
    const isCentral = i === 0;
    const angle = Math.PI / 3;

    const points = [];
    for (let i = 0; i < 6; i++) {
      const currentAngle = angle * i;
      const x = cx + R * Math.cos(currentAngle);
      const y = cy + R * Math.sin(currentAngle);
      points.push(`${x},${y}`);
    }

    const d = `M${points.join("L")}Z`;

    return hs("path", {
      d,
      class: classes("letter-buttons__cell", {
        "letter-buttons__cell--central": isCentral,
      }),
      onclick: function () {
        self.dispatchEvent(
          new Event("letter-button-pressed", {
            detail: { index: i, letter: self.letters[i] },
          }),
        );
        this.classList.add("letter-buttons__cell--pressed");
        setTimeout(() => {
          this.classList.remove("letter-buttons__cell--pressed");
        }, 100);
      },
      style: {
        transformOrigin: `${cx}px ${cy}px`,
      },
      stroke: "none",
    });
  }

  /**
   *  This is a variation of Fisher-Yates with two tweaks
   *  1. It leaves the first element (central letter) in place
   *  2. The rest of the letters are guaranteed to be a derangement. i.e.,
   *     none of them will retain their original position. (it just
   *     doesn't look right if they don't all move)
   */
  shuffle() {
    for (let i = 1; i < this.letters.length - 1; i++) {
      // Shift the range so that i never equals randIdx
      const randIdx =
        Math.floor(Math.random() * (this.letters.length - 1 - i)) + i + 1;

      // Swap the letters
      [this.letters[i], this.letters[randIdx]] = [
        this.letters[randIdx],
        this.letters[i],
      ];
    }

    this.update();
  }

  static register() {
    customElements.define("sg-letter-buttons", LetterButtons);
  }
}
