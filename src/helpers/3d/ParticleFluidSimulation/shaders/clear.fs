precision mediump float;
precision mediump sampler2D;

uniform sampler2D t_diffuse;
uniform float u_dissipation;

varying highp vec2 vUv;

void main () {
  gl_FragColor = u_dissipation * texture2D(t_diffuse, vUv);
}