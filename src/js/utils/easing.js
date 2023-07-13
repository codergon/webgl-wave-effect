export function easeInQuad(x) {
  return x * x;
}

export function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeInBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * x * x * x - c1 * x * x;
}

export function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
