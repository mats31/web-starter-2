precision highp float;
precision highp sampler2D;

uniform sampler2D t_velocity;
uniform sampler2D t_source;
uniform vec2 u_texelSize;
uniform float u_dt;
uniform float u_dissipation;

varying vec2 vUv;

void main () {
  vec2 coord = vUv - u_dt * texture2D(t_velocity, vUv).xy * u_texelSize;
  gl_FragColor = u_dissipation * texture2D(t_source, coord);
  gl_FragColor.a = 1.0;
}