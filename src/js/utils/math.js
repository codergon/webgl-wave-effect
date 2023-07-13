import GSAP from "gsap";

export function lerp(p1, p2, t) {
  return GSAP.utils.interpolate(p1, p2, t);
}

export function clamp(min, max, number) {
  return GSAP.utils.clamp(min, max, number);
}

export function random(min, max) {
  return GSAP.utils.random(min, max);
}

export function mapRange(valueToMap, inMin, inMax, outMin, outMax) {
  return ((valueToMap - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
