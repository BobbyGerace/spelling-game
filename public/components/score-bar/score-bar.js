import { h } from "../../lib/h.js";

const LEVELS = [
  { name: "Beginner", threshold: 0 },
  { name: "Good Start", threshold: 2 },
  { name: "Moving Up", threshold: 5 },
  { name: "Good", threshold: 8 },
  { name: "Solid", threshold: 15 },
  { name: "Nice", threshold: 25 },
  { name: "Great", threshold: 40 },
  { name: "Amazing", threshold: 50 },
  { name: "Genius", threshold: 70 },
  { name: "Wizard", threshold: 100 },
];

const LEVELS_WITH_NODES = LEVELS.slice(0, -1); // exclude Wizard

function getLevelAtPercentage(pct) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (pct >= level.threshold) current = level;
  }
  return current;
}

export class ScoreBar extends HTMLElement {
  connectedCallback() {
    this.scoreEl = h("span", { class: "score-bar__score" });
    this.levelEl = h("span", { class: "score-bar__level" });
    this.trackEl = h("div", { class: "score-bar__track" });
    this.fillEl = h("div", { class: "score-bar__fill" });
    this.nodesEl = h("div", { class: "score-bar__nodes" });

    this.trackEl.appendChild(this.fillEl);
    this.trackEl.appendChild(this.nodesEl);

    this.appendChild(this.scoreEl);
    this.appendChild(this.trackEl);
    this.appendChild(this.levelEl);

    this.update();
  }

  update() {
    if (!this.model) return;

    const score = this.model.getScore();
    const total = this.model.getTotalPoints();
    const pct = total > 0 ? Math.min(100, (score / total) * 100) : 0;
    const level = getLevelAtPercentage(pct);

    const nodeCount = LEVELS_WITH_NODES.length;
    const lastReachedNodeIndex = Math.min(
      LEVELS.indexOf(level),
      nodeCount - 1,
    );
    const fillWidthPct = (lastReachedNodeIndex / (nodeCount - 1)) * 100;

    this.scoreEl.textContent = score;
    this.levelEl.textContent = level.name;
    this.fillEl.style.width = `${fillWidthPct}%`;

    this.nodesEl.innerHTML = "";
    for (let i = 0; i < nodeCount; i++) {
      const reached = i <= lastReachedNodeIndex;
      const node = h("span", {
        class: `score-bar__node${reached ? " score-bar__node--reached" : ""}`,
      });
      this.nodesEl.appendChild(node);
    }
  }

  static register() {
    customElements.define("sg-score-bar", ScoreBar);
  }
}
