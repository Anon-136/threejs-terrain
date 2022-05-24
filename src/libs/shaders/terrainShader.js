export const terrainShader = (function () {
  // Vertex shader
  const _VS = `
 // Attributes

// Outputs
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

#define saturate(a) clamp( a, 0.0, 1.0 )

void main() {
  vNormal = normal;
  vPosition = position.xyz;

  float heightValue = clamp(position.y / 255.0, 0.0, 1.0);

  if (heightValue < 0.2) {
    vColor = vec3(0.0, 0.0, 1.0);
  }
  else if (heightValue < 0.5) {
    vColor = vec3(0.0588, 0.6118, 0.4);
  }
  else if (heightValue < 0.8) {
    vColor = vec3(0.4784, 0.3647, 0.1451);
  }
  else {
    vColor = vec3(1.0, 1.0, 1.0);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
} 
`

  // Fragment shader
  const _PS = `
// Inputs from vertextShader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;


void main() {
  vec3 light = vec3(1, 1, 1);
  light = normalize(light);
  float dProd = max(0.0, dot(vNormal, light));

  vec3 color = dProd * vColor;

  gl_FragColor = vec4(color, 1.0);
}
`

  return {
    VS: _VS,
    PS: _PS,
  }
})()
