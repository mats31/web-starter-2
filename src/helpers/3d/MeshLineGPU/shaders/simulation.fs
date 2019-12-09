// simulation

varying vec2 vUv;
uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_info;
uniform lowp vec2 uResolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {
  vec4 texturePos = texture2D( t_pos, vUv );
  vec4 textureInfo = texture2D( t_info, vUv );

  vec3 pos = texturePos.xyz;
  float isFirst = textureInfo.z;

  if (isFirst >= 1.) {
    pos.x += 0.1;
  } else {
    vec2 uvPrev = textureInfo.xy;
    vec3 prev = texture2D( t_pos, uvPrev ).xyz;

    pos.xyz +=  (prev.xyz - pos.xyz) * .05;
  }

  gl_FragColor = vec4( pos, 1. );
}
