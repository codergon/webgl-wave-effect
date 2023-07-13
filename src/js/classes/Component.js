import each from "lodash/each";
import AutoBind from "auto-bind";
import EventEmitter from "events";

export default class Component extends EventEmitter {
  constructor({ element, elements }) {
    super();

    // Bind all methods of the instance to the instance itself
    AutoBind(this);

    this.element = element;
    this.selectorChildren = { ...elements };

    this.setup();
  }

  setup() {
    const isHtmlElement = this.element instanceof HTMLElement;

    this.element = isHtmlElement
      ? this.element
      : document.querySelector(this.element);

    this.elements = {};

    each(this.selectorChildren, (selector, key) => {
      if (
        selector instanceof HTMLElement ||
        selector instanceof NodeList ||
        Array.isArray(selector)
      ) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });
  }
}
