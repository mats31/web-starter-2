precision mediump float;
precision mediump sampler2D;

uniform sampler2D t_pressure;
uniform sampler2D t_divergence;

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
  float C = texture2D(t_pressure, vUv).x;
  float divergence = texture2D(t_divergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}