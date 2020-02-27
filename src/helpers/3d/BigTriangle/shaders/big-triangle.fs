precision highp float;

uniform sampler2D t_diffuse;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(t_diffuse, vUv);

  vec3 color = texture.rgb;
  float alpha = texture.a;

  gl_FragColor = vec4(color, alpha);
}
