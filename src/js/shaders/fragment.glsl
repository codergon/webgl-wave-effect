precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec4 texColor = texture2D(tMap, uv);
  vec3 grayscaleColor = vec3(dot(texColor.rgb, vec3(0.299, 0.587, 0.114)));

  // Apply the wave effect color overlay
  vec3 waveColor = texColor.rgb;
  if (uv.x > (-0.175 + 0.1) && uv.x < (0.175 + 0.1)) {
    waveColor = texColor.rgb;
  } else {
    waveColor = grayscaleColor;
  }

  gl_FragColor.rgb = waveColor;
  gl_FragColor.a = 1.0;
}
