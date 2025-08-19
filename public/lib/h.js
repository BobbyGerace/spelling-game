const createH = (namespace) => (tag, props, children) => {
  const propsIsChildType =
    Array.isArray(props) || typeof props === "string" || props instanceof Node;
  if (typeof children === "undefined" && propsIsChildType) {
    children = props;
    props = {};
  }

  const node = document.createElementNS(namespace, tag);

  for (const key in props) {
    // TODO: Maybe make a special case to handle style as an object
    if (key.startsWith("on")) {
      node[key] = props[key];
    } else if (key === "style" && typeof props[key] !== "string") {
      applyStyles(node, props[key]);
    } else {
      node.setAttribute(key, props[key]);
    }
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

const applyStyles = (node, styles) => {
  for (const key in styles) {
    node.style[key] = styles[key];
  }
};

// For regular HTML
export const h = createH("http://www.w3.org/1999/xhtml");

// For SVGs
export const hs = createH("http://www.w3.org/2000/svg");
