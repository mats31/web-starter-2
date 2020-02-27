precision highp float;
precision highp sampler2D;

uniform sampler2D t_velocity;
uniform sampler2D t_source;
uniform vec2 u_texelSize;
uniform vec2 u_dyeTexelSize;
uniform float u_dt;
uniform float u_dissipation;

varying vec2 vUv;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
  vec2 coord = vUv - u_dt * bilerp(t_velocity, vUv, u_texelSize).xy * u_texelSize;
  gl_FragColor = u_dissipation * bilerp(t_source, coord, u_dyeTexelSize);
  gl_FragColor.a = 1.0;
}