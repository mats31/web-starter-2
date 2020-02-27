precision highp float;
precision highp sampler2D;

uniform sampler2D t_target;
uniform float u_aspectRatio;
uniform vec3 u_color;
uniform vec2 u_point;
uniform float u_radius;

varying vec2 vUv;

void main () {

    vec2 p = vUv - u_point.xy;
    // p.x *= u_aspectRatio; = if perspective

    vec3 splat = exp(-dot(p, p) / u_radius) * u_color;

    vec3 base = texture2D(t_target, vUv).xyz;

    gl_FragColor = vec4(base + splat, 1.0);
}