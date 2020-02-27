precision highp float;
precision highp sampler2D;

uniform sampler2D t_velocity;
uniform sampler2D t_curl;
uniform float u_curl;
uniform float u_dt;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main () {
  float L = texture2D(t_curl, vL).x;
  float R = texture2D(t_curl, vR).x;
  float T = texture2D(t_curl, vT).x;
  float B = texture2D(t_curl, vB).x;
  float C = texture2D(t_curl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= u_curl * C;
  force.y *= -1.0;
  vec2 vel = texture2D(t_velocity, vUv).xy;
  gl_FragColor = vec4(vel + force * u_dt, 0.0, 1.0);
}