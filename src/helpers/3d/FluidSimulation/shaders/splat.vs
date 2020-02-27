precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;

attribute lowp vec2 position;
attribute lowp vec2 uv;

varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0., 1.0);
}