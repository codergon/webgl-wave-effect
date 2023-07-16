varying vec2 vUv;
varying float normalizedX;

uniform float uCursor;
uniform float uImgWidth;
uniform sampler2D tDiffuse;
uniform vec2 uViewportSizes;


void main() {
    vec4 texColor = texture2D(tDiffuse, vUv);
    vec3 grayColor = vec3(dot(texColor.rgb, vec3(0.2989, 0.587, 0.114))); 

    float effectW = (uImgWidth / uViewportSizes.x) / 2.;

    vec3 waveColor = texColor.rgb;
    if (vUv.x > (0.5 - effectW + uCursor) && vUv.x < (effectW + uCursor + 0.5)) {
        waveColor = texColor.rgb;
    } else {
        waveColor = grayColor;
    }

    gl_FragColor.rgb = waveColor;
    gl_FragColor.a = 1.0;
}
