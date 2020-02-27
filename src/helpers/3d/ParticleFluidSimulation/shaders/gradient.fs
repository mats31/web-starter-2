precision mediump float;
precision mediump sampler2D;

uniform sampler2D t_pressure;
uniform sampler2D t_velocity;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

void main () {
  float L = texture2D(t_pressure, vL).x;
  float R = texture2D(t_pressure, vR).x;
  float T = texture2D(t_pressure, vT).x;
  float B = texture2D(t_pressure, vB).x;
  vec2 velocity = texture2D(t_velocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}