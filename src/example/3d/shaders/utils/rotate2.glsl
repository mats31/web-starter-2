vec2 rotate2(vec2 pos, float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  
  return mat2(c, s, -s, c) * pos;
}

#pragma glslify: export(rotate2)