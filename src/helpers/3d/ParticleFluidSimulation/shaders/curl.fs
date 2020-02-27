precision mediump float;
precision mediump sampler2D;

uniform sampler2D t_velocity;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

void main () {
  float L = texture2D(t_velocity, vL).y;
  float R = texture2D(t_velocity, vR).y;
  float T = texture2D(t_velocity, vT).x;
  float B = texture2D(t_velocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}