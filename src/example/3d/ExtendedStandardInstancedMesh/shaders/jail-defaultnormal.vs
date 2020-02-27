vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING

  mat4 rotMat = rotationMatrix(vec3(1., 0., 0.), u_time * a_speed * 3.);

  mat4 instanceMat = instanceMatrix * rotMat;

  instanceMat[3][0] = instanceMat[3][0] + sin(u_time * a_speed * 3.) * 0.06;
  instanceMat[3][1] = instanceMat[3][1] + cos(u_time * a_speed * 3.) * 0.06;
  instanceMat[3][2] = instanceMat[3][2] + sin(u_time * a_speed * 3.) * 0.06;

  instanceMat[0][0] = instanceMat[0][0] + sin(u_time * a_speed * 1.) * 0.05;
  instanceMat[1][1] = instanceMat[1][1] + sin(u_time * a_speed * 1.) * 0.05;
  instanceMat[2][2] = instanceMat[2][2] + sin(u_time * a_speed * 1.) * 0.05;


	transformedNormal = mat3( instanceMat ) * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif