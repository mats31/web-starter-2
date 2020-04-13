
// Global variables
vec2 sc=vec2(0.); // Scene
vec2 e=vec2(0.000035,-0.000035); // Epsilon
float t;
float modT;
float glow1 = 0.; // Glow

// UTILS --------

#include "./../example/3d/shaders/utils/rotate.glsl"

// DISTANCE FUNCTIONS ------------------------

#include "./../example/3d/shaders/raymarching/sdPlane.glsl"
#include "./../example/3d/shaders/raymarching/sdSphere.glsl"
#include "./../example/3d/shaders/raymarching/sdBox.glsl"
#include "./../example/3d/shaders/raymarching/sdRoundBox.glsl"
#include "./../example/3d/shaders/raymarching/sdHexPrism.glsl"

// Material ------------------------

vec3 albedo(vec3 pos) {
  return fract(pos.x * .5) * vec3(1.);
}

vec3 lightDirection = normalize(vec3(0.0, 0., -10.)) * 0.5 + 0.5;

float diffuse(vec3 normal)
{
  return max(dot(normal, lightDirection), 0.);
}

float specular(vec3 normal, vec3 dir)
{
  vec3 h = normalize(normal - dir);
  return pow(max(dot(h, normal), 0.), 100.);
}

// Deformation -----

// NOISE ================

#include "./../example/3d/shaders/noises/vNoise3.glsl"

// MAP ==================

vec2 fb( vec3 pos )
{
  vec2 a = vec2(sdPlane(pos), 0.);

  pos.z += -15.;
  vec2 b = vec2(sdBox(pos, vec3(1.)), 1.);
  glow1 += 0.1 / (0.1 + b.x * b.x * b.x);

  a = ( a.x < b.x ) ? a : b;

  return a;
}

vec2 map(vec3 pos)
{
  // float planeDist = plane(pos);

  // float mountainNoise = fbm(pos, fract(iGlobalTime));
  // planeDist -= mountainNoise;


  // vec3 sP = pos + vec3(0., 0., -4.);
  // float sphere = sdSphere(sP, 1.);
  // float box = sdBox(sP, vec3(1.));
  // float prism = sdHexPrism(sP, vec2(1.));
  // float finalMesh = mix(sphere, prism, (sin(iGlobalTime) + 1.) * 0.5 );
  // float sDis = finalMesh + displacement(sP);

  // return vec2(planeDist, 0.);
  return vec2(fb(pos));
}

vec2 raymarching(vec3 ro, vec3 rd, float far, float prec)
{
  vec2 h, t = vec2(0.1);

  for(int i = 0; i < 128; i++){
    h = map(ro + rd * t.x);

    if (h.x < prec || t.x > far)
      break;

    t.x += h.x;
    t.y = h.y;
  }

  if (t.x>far) t.x = 0.;
  return t;
}

vec3 computeNormal(vec3 pos)
{
  return normalize(vec3(
    map(pos + e.xyy).x - map(pos - e.xyy).x,
    map(pos + e.yxy).x - map(pos - e.yxy).x,
    map(pos + e.yyx).x - map(pos - e.yyx).x
  ));
}


void main() {

  // Modulo time ------------
  modT = mod(iGlobalTime, 100.);


  // UVS ------------
  vec2 st = (gl_FragCoord.xy / iResolution.xy);
  st -= 0.5;

  // CAMERA -----------
  vec3 ro=vec3(0.,1.,20.); // ro = Ray Origin = Camera Position
  vec3 cw=normalize(vec3(0., 0., 0.) - ro); // Vec3 here is the camera target
  vec3 cu=normalize(cross(cw, vec3(0.,1.,0.))); 
  vec3 cv=normalize(cross(cu, cw));
  float fov = 0.5; // Field of view
  vec3 rd=mat3(cu, cv, cw)*normalize(vec3(st, fov)); // rd = Ray Direction

  // COLOR , FOG, LIGHT DIRECTION ------
  vec3 co = vec3(length(st));
  vec3 fg = co;
  vec3 ld = normalize(vec3(0., 0.1, 0.));

  float far = 50.;
  float prec = 0.0001;
  sc = raymarching(ro, rd, far, prec); // sc.x = geometry / sc.y = color id
  t = sc.x;

  if (t > 0.) { // If above 0, t is distance
    vec3 po = ro+rd*t; // Position
    vec3 no = computeNormal(po); // Normal
    vec3 al = sc.y == 1. ? vec3(0.5,0.9,0.1) : vec3(0.2, 0.9, 0.6); // Albedo


    co = al;
    co = mix(co, fg, 1. - exp(-0.00003 * t * t * t)); // Fog
  }

  co += glow1 * 0.03;
  gl_FragColor = vec4(co, 1.);
}
