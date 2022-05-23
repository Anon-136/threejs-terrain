export const terrainShader = (function () {
  // Vertex shader
  const _VS = `
 // Attributes

// Outputs
varying vec3 vNormal;
varying vec3 vPosition;


#define saturate(a) clamp( a, 0.0, 1.0 )

void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);

  vNormal = normal;

  vPosition = position.xyz;
} 
`

  // Fragment shader
  const _PS = `
// Inputs from vertextShader
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 light = vec3(1, 1, 1);
  light = normalize(light);

  float heightValue = clamp(vPosition.y / 255.0, 0.0, 1.0);

  float dProd = max(0.0, dot(vNormal, light));

  float color = dProd * heightValue;

  gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}
`

  return {
    VS: _VS,
    PS: _PS,
  }
})()
