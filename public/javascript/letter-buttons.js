export class LetterButtons extends HTMLElement {
  connectedCallback() {
    this.drawSvg();
  }

  drawSvg() {
    this.svg = hs(
      "svg",
      {
        viewBox: "-100 -100 200 200",
      },
      [this.drawHexagon(0, 0)],
    );

    this.appendChild(this.svg);
  }

  drawHexagon(cx, cy) {
    const r = 40;
    const angle = Math.PI / 3;

    const points = [];
    for (let i = 0; i < 6; i++) {
      const currentAngle = angle * i;
      const x = cx + r * Math.cos(currentAngle);
      const y = cy + r * Math.sin(currentAngle);
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
