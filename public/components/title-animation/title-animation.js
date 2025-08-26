import { hs } from "../../lib/h.js";
import { classes } from "../../lib/classes.js";
import { roundedHexPath } from "../../lib/rounded-hex-path.js";

const R = 30;
const GAP = 3;
const CORNER_R = 7;
const SQ3 = Math.sqrt(3);
const X_STEP = (3 * R) / 2 + SQ3 * GAP;

export class TitleAnimation extends HTMLElement {
  cells = [];

  connectedCallback() {
    this.drawSvg();
  }

  drawSvg() {
    const coords = this.hexCenters();

    this.cells = this.drawCells(coords);

    this.cellGroup = hs(
      "g",
      { class: "title-animation__cell-group" },
      this.cells,
    );

    this.setAnimDelays(this.cells);

    this.svg = hs(
      "svg",
      {
        viewBox: "0 0 600 300",
      },
      [
        this.cellGroup,
        hs(
          "text",
          { class: "title-animation__word", x: 80, y: 160 },
          "Spelling",
        ),
        hs("text", { class: "title-animation__word", x: 240, y: 240 }, "Game"),
      ],
    );

    this.appendChild(this.svg);
  }

  hexCenters() {
    const pos = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 6; j++) {
        pos.push([i, j]);
      }
    }

    return [
      ["2", "4"],
      ["3", "2"],
      ["4", "2"],
      ["4", "3"],
      ["4", "4"],
      ["5", "2"],
      ["5", "4"],
      ["6", "1"],
      ["6", "3"],
      ["6", "4"],
      ["7", "0"],
      ["7", "2"],
      ["7", "4"],
      ["8", "5"],
      ["6", "2"],
      ["3", "3"],
      ["4", "5"],
      ["5", "3"],
      ["5", "0"],
      ["2", "1"],
      ["4", "1"],
      ["5", "1"],
      ["1", "3"],
      ["8", "0"],
      ["3", "1"],
      ["1", "0"],
      ["8", "1"],
    ];
  }

  drawCells(coords) {
    return coords.map(([x, y], i) => this.drawRoundedHexagon(x, y, i));
  }

  drawRoundedHexagon(row, col) {
    const self = this;

    const offset = row % 2 === 0 ? 0 : X_STEP;
    const cy = R + row * ((R * SQ3) / 2 + GAP);
    const cx = R + col * 2 * X_STEP + offset;

    let d = roundedHexPath(cx, cy, R, CORNER_R);

    const path = hs("path", {
      d,
      class: classes("title-animation__cell"),
      stroke: "none",
    });

    return path;
  }

  setAnimDelays(cells) {
    // Let's not mutate the arguments
    cells = [...cells];

    // Shuffle
    for (let i = cells.length - 1; i > 0; i--) {
      const randIdx = Math.floor(Math.random() * i);

      [cells[randIdx], cells[i]] = [cells[i], cells[randIdx]];
    }

    this.cells.forEach((cell, i) => {
      const fuzzFactor = Math.round(Math.random() * 100) / 100 - 0.5;
      cell.style.animationDelay = i + fuzzFactor + "s";
    });
  }

  static register() {
    customElements.define("sg-title-animation", TitleAnimation);
  }
}
