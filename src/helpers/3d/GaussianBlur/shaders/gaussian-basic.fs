precision highp float;

uniform sampler2D t_diffuse;
uniform float u_alpha;

uniform vec3 u_clearColor;

varying vec2 vUv;

void main() {

	vec2 uv = vUv;

    vec4 tex = texture2D(t_diffuse, uv);
    // vec3 cBackground = u_clearColor;

    // vec4 c = vec4 ( ( ( 1.0 - tex.a ) * cBackground.rgb ) + tex.rgb , u_alpha );

    // gl_FragColor = c;
    gl_FragColor = tex;
}