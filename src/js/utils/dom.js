import map from "lodash/map";

export const getOffset = (element, top = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + top,
    width: box.width,
  };
};

export function mapEach(element, callback) {
  // If the element is an instance of HTMLElement,
  // just apply the callback to it and return an array containing the result.
  if (element instanceof window.HTMLElement) {
    return [callback(element)];
  }

  return map(element, callback);
}

export const isElementVisible = (element, topOffset = 0, bottomOffset = 0) => {
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  const topThreshold = topOffset.endsWith("%")
    ? (viewHeight * parseInt(topOffset)) / 100
    : parseInt(topOffset);
  const bottomThreshold = bottomOffset.endsWith("%")
    ? (viewHeight * parseInt(bottomOffset)) / 100
    : parseInt(bottomOffset);
  return !(
    rect.bottom - bottomThreshold < 0 || rect.top - topThreshold >= viewHeight
  );
};

export function findAllDescendants(parent, selector) {
  return parent.querySelectorAll(selector);
}

export function wrapElement(element, wrapper) {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}
