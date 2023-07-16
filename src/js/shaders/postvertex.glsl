varying vec2 vUv;
varying float normalizedX;

uniform vec2 uViewportSizes;

void main() {
  vUv = uv;
  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
  normalizedX = newPosition.x / uViewportSizes.x;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}