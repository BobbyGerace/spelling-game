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
          fill: "white",
        },
        letters[i],
      ),
    );
  }

  drawCells(coords) {
    return coords.map(([x, y]) => this.drawHexagon(x, y));
  }

  drawHexagon(cx, cy) {
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
      fill: "#393B44",
      stroke: "none",
    });
  }

  static register() {
    customElements.define("sg-letter-buttons", LetterButtons);
  }
}

const svgNS = "http://www.w3.org/2000/svg";

const hs = (tag, props, children) => {
  const propsIsChildType =
    Array.isArray(props) || typeof props === "string" || props instanceof Node;
  if (typeof children === "undefined" && propsIsChildType) {
    children = props;
    props = {};
  }

  const node = document.createElementNS(svgNS, tag);

  for (const key in props) {
    node.setAttribute(key, props[key]);
  }

  if (Array.isArray(children)) {
    for (const child of children) {
      appendChild(node, child);
    }
  } else if (children != null) {
    appendChild(node, children);
  }

  return node;
};

const appendChild = (node, child) => {
  if (typeof child === "string") {
    const textNode = document.createTextNode(child);
    node.appendChild(textNode);
  } else if (child instanceof Node) {
    node.appendChild(child);
  } else {
    console.warn(
      `Ignoring uenexpcted value passed to appendChild: ${typeof child}`,
    );
  }
};
