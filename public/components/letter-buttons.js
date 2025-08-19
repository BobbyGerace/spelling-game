import { hs } from "../lib/h.js";
import { classes } from "../lib/classes.js";
const R = 20;
const GAP = 3;

export class LetterButtons extends HTMLElement {
  connectedCallback() {
    this.letters = "ABCDEFG".split("");
    this.cells = [];

    this.drawSvg();
  }

  static get observedAttributes() {
    return ["letters"];
  }

  drawSvg() {
    const coords = this.hexCenters();

    this.cells = this.drawCells(coords);

    this.letters = this.drawLetters(coords, this.letters);

    this.svg = hs(
      "svg",
      {
        viewBox: "-100 -100 200 200",
        class: "letter-buttons",
      },
      [...this.cells, ...this.letters],
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
    return coords.map(([x, y], i) => this.drawHexagon(x, y, i === 0));
  }

  drawHexagon(cx, cy, isCentral = false) {
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
      stroke: "none",
    });
  }

  static register() {
    customElements.define("sg-letter-buttons", LetterButtons);
  }
}
