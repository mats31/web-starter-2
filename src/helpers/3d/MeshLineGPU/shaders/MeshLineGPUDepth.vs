#include <common>
#include <logdepthbuf_pars_vertex>


attribute mediump vec2 ID;
attribute mediump vec2 prevID;
attribute mediump vec2 nextID;
attribute lowp float side;

uniform lowp vec2 resolution;
uniform mediump float lineWidth;
uniform sampler2D positions;

varying float alpha;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {
	float aspect = resolution.x / resolution.y;

	alpha = texture2D(positions,ID).a;
	mat4 m = projectionMatrix * modelViewMatrix;
	vec4 finalPosition = m * vec4( texture2D(positions,ID).rgb, 1.0 );
	vec4 prevPos = m * vec4( texture2D(positions,prevID).rgb, 1.0 );
	vec4 nextPos = m * vec4( texture2D(positions,nextID).rgb, 1.0 );

	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	vec2 dir = normalize( nextP - prevP );
	finalPosition.xy += vec2( -dir.y/aspect, dir.x ) * lineWidth * side;
	gl_Position = finalPosition;
	#include <logdepthbuf_vertex>
}
