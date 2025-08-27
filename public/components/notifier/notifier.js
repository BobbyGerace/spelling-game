import { h } from "../../lib/h.js";

export class Notifier extends HTMLElement {
  timeout = null;

  showSubmitResult(result) {
    if (result.success) {
      const { points, isPangram } = result;

      if (isPangram) this.displayMessage(`Pangram! +${points}`);
      else if (points === 1) this.displayMessage(`Good +${points}`);
      else if (points > 7) this.displayMessage(`Awesome! +${points}`);
      else this.displayMessage(`Nice! +${points}`);
    } else {
      this.displayMessage(result.reason);
    }
  }

  displayMessage(message) {
    clearTimeout(this.timeout);
    this.clear();

    this.appendChild(h("div", { class: "notifier__message" }, message));
    this.timeout = setTimeout(this.clear.bind(this), 2000);
  }

  clear() {
    [...this.children].forEach((c) => c.remove());
  }

  static register() {
    customElements.define("sg-notifier", Notifier);
  }
}
