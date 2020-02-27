vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING
	mvPosition = instanceMat * mvPosition;
#endif

mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;