varying vec2 vUv;
uniform vec2 uMouse;
uniform float uVelo;
uniform vec2 resolution;
uniform sampler2D tDiffuse;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv *= resolution;
    float dist = length(uv);
    return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

void main() {
    vec2 newUV = vUv;
    vec4 color = vec4(1., 0., 0., 1.);
	
    float c = circle(newUV, uMouse, 0.0, 0.1 + uVelo * 2.) * 40. * uVelo;
    vec2 warpedUV = mix(vUv, uMouse, c * 0.99); //power
    color = texture2D(tDiffuse, warpedUV) + texture2D(tDiffuse, warpedUV) * vec4(vec3(c), 1.);

    gl_FragColor = color;
}
