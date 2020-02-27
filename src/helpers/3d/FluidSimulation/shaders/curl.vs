precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform vec2 u_texelSize;

attribute lowp vec2 position;
attribute lowp vec2 uv;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

void main() {

  vUv = uv;
  vL = vUv - vec2(u_texelSize.x, 0.0);
  vR = vUv + vec2(u_texelSize.x, 0.0);
  vT = vUv + vec2(0.0, u_texelSize.y);
  vB = vUv - vec2(0.0, u_texelSize.y);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0., 1.0);
}