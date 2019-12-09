#define DEPTH_PACKING 0
#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying lowp float alpha;
uniform float alphaTest;
void main() {
	#include <clipping_planes_fragment>
	if(alpha<alphaTest) discard;
	#include <logdepthbuf_fragment>
	#include <encodings_fragment>

}
