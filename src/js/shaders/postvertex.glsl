#define PI 3.1415926535897932384626433832795
uniform float time;
uniform float progress;
uniform vec2 resolution;
varying vec2 vUv;
uniform sampler2D texture1;

uniform float uStrength;
uniform vec2 uViewportSizes;


void main() {
  vUv = uv;
  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  float cursor = 0.1;
  float range = 0.175;

  float normalizedX = newPosition.x / uViewportSizes.x;

  if (normalizedX > (-range + cursor) && normalizedX < (range + cursor)) {
    normalizedX = (normalizedX - cursor) / (range * 2.0);
    newPosition.z += sin(normalizedX * PI + PI / 2.0) * -uStrength;
  }

  gl_Position = projectionMatrix * newPosition;
}


