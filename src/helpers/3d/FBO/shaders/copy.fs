varying vec2 vUv;
uniform sampler2D t_pos;

void main() {
	gl_FragColor = texture2D( t_pos, vUv );
}
