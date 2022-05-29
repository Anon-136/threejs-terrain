export const vertexShader = `
struct ColorSpline {
    float point;
    vec3 hslColor;
};

uniform vec3 sunDirection;
uniform ColorSpline aridSpline[3];
uniform ColorSpline humidSpline[3];
uniform ColorSpline ocean;
uniform ColorSpline beach;

// Inputs
attribute float height;
attribute float moisture;

// Outputs
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

#define saturate(a) clamp( a, 0.0, 1.0 )

// code from https://www.shadertoy.com/view/XljGzV
vec3 HSL2RGB(in vec3 c) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

vec3 BlendColorHeight(ColorSpline splines[3], float h) {
   int p1 = 0;

   for (int i = 0; i < 3; i++) {
       if (h <= splines[i].point) {
           break;
       }
       p1 = i;
   }

   int p2 = min(2, p1 + 1);
   if (p1 == p2) {
       return splines[p1].hslColor;
   }
   
   float ratio = (h - splines[p1].point) / (splines[p2].point - splines[p1].point);
   return mix(splines[p1].hslColor, splines[p2].hslColor, ratio);
}

void main() {
  
  vNormal = normal;
  vPosition = position.xyz;

  if (height <= ocean.point) {
      vColor = HSL2RGB(ocean.hslColor);
  }
  else if (height <= beach.point) {
      vColor = HSL2RGB(beach.hslColor);
  }
  else {
    vec3 arid = BlendColorHeight(aridSpline, height);
    vec3 humid = BlendColorHeight(humidSpline, height);
    vColor = HSL2RGB(mix(arid, humid, moisture));
  }
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
}
`
export const fragmentShader = `
uniform vec3 sunDirection;

// Inputs
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

void main() {
  vec3 light = normalize(sunDirection);
  float dProd = max(0.0, dot(vNormal, light));

  vec3 color = dProd * vColor;

  gl_FragColor = vec4(color, 1.0);
}
`
