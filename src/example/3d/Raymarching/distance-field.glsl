#define GLSLIFY 1

float plane(vec3 pos) {
  return pos.y;
}

float sdPlane( vec3 p, vec4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdHexPrism( vec3 p, vec2 h )
{
  const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
  p = abs(p);
  p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
  vec2 d = vec2(
       length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
       p.z-h.y );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  // q.x += sin(u_time + fract(p.z)) * 3.;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float customSdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  // q.y = q.y + sin(u_time + p.z * 2.) * 4. * u_deform + 2. * u_deform;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float customSdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  // q.y += sin(u_time + p.z * 2.) * 4. * u_deform;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}