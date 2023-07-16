#define PI 3.1415926535897932384626433832795

precision highp float;
precision highp int;

uniform float uCursor;
uniform float uStrength;
uniform float uImgWidth;
uniform vec2 uViewportSizes;

varying vec2 vUv;

void main() {
   vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

   float effectW = uImgWidth;

   float normalizedX = newPosition.x / uViewportSizes.x;

  if (normalizedX > (-effectW + uCursor) && normalizedX < (effectW + uCursor)) {
    normalizedX = (normalizedX - uCursor) / (effectW * 2.0);
    newPosition.z += sin(normalizedX * PI + PI / 2.0) * -uStrength;
  }

  vUv = uv;

  gl_Position = projectionMatrix * newPosition;
}
