#define PI 3.1415926535897932384626433832795

precision highp float;
precision highp int;

uniform float uStrength;
uniform vec2 uViewportSizes;
// uniform float cursor; // New variable for controlling the center of the effect

varying vec2 vUv;

void main() {
   vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

   float cursor = 0.1;
   float range = 0.175;

   float normalizedX = newPosition.x / uViewportSizes.x;

  if (normalizedX > (-range + cursor) && normalizedX < (range + cursor)) {
    normalizedX = (normalizedX - cursor) / (range * 2.0);
    newPosition.z += sin(normalizedX * PI + PI / 2.0) * -uStrength;
  }

  vUv = uv;

  gl_Position = projectionMatrix * newPosition;
}
