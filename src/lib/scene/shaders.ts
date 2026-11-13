/* ==========================================================================
   SHADERS — partículas que se transformam e a gema iridescente.
   ========================================================================== */

// Simplex noise 3D — Ashima Arts / Stefan Gustavson (MIT)
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* -------------------------------------------------------------------------- */
/* Partículas                                                                  */
/* -------------------------------------------------------------------------- */

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uSize;
uniform vec3 uMouse;
uniform float uMouseForce;

attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute vec3 aP4;
attribute vec4 aRnd;

varying float vAlpha;
varying float vMix;

float stage(float m, float i, float d) {
  float t = clamp((m - i) * 1.6 - d * 0.6, 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float t1 = stage(uMorph, 0.0, aRnd.x);
  float t2 = stage(uMorph, 1.0, aRnd.x);
  float t3 = stage(uMorph, 2.0, aRnd.x);
  float t4 = stage(uMorph, 3.0, aRnd.x);

  vec3 p = position;
  p = mix(p, aP1, t1);
  p = mix(p, aP2, t2);
  p = mix(p, aP3, t3);
  p = mix(p, aP4, t4);

  // Respiração orgânica — forte na nuvem, contida quando há estrutura
  float drift = mix(0.35, 0.03, t1) + t4 * 0.05;
  p += vec3(
    sin(uTime * 0.31 + aRnd.y * 6.2831),
    cos(uTime * 0.27 + aRnd.z * 6.2831),
    sin(uTime * 0.23 + aRnd.w * 6.2831)
  ) * drift;

  // Órbita final: o anel gira em torno da gema
  float orbit = uTime * (0.12 + aRnd.y * 0.08) * t4;
  float co = cos(orbit), so = sin(orbit);
  p.xz = mat2(co, -so, so, co) * p.xz;

  // Entrada: explode a partir do centro
  float intro = clamp(uIntro * 1.4 - aRnd.x * 0.4, 0.0, 1.0);
  intro = 1.0 - pow(1.0 - intro, 3.0);
  p = mix(p * 0.02, p, intro);

  vec4 world = modelMatrix * vec4(p, 1.0);

  // Repulsão pelo cursor (no plano da tela)
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float force = smoothstep(1.8, 0.0, dist) * uMouseForce * (1.0 - t3 * 0.6);
  world.xy += normalize(d + 0.0001) * force * (0.6 + aRnd.z * 0.6);

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.35 + aRnd.w * 1.1) * mix(1.25, 0.8, t2) * (1.0 + t4 * 0.35);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

  float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aRnd.z * 2.0) + aRnd.y * 40.0);
  vAlpha = (0.3 + 0.7 * aRnd.y) * twinkle * intro * (1.0 + t4 * 0.6);
  vMix = clamp(aRnd.z * 0.7 + (world.y * 0.12) + 0.2, 0.0, 1.0);
}
`;

export const particlesFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vAlpha;
varying float vMix;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.8);
  vec3 c = mix(uColorA, uColorB, vMix);
  gl_FragColor = vec4(c, a * vAlpha * uOpacity);
}
`;

/* -------------------------------------------------------------------------- */
/* Gema                                                                        */
/* -------------------------------------------------------------------------- */

export const gemVertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vObjPos;
${noise}

vec3 displace(vec3 p) {
  float n = snoise(p * 0.9 + vec3(0.0, uTime * 0.12, uTime * 0.08));
  return p + normalize(p) * n * uDistort;
}

void main() {
  vec3 p = displace(position);

  // Normal por diferenças finitas (vizinhos na tangente)
  vec3 n = normalize(position);
  vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 b = cross(n, t);
  float e = 0.02;
  vec3 pt = displace(position + t * e);
  vec3 pb = displace(position + b * e);
  vec3 dn = normalize(cross(pt - p, pb - p));

  vObjPos = position;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * dn);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const gemFragment = /* glsl */ `
uniform float uTime;
uniform float uBuild;
uniform float uPolish;
uniform float uOpacity;
uniform vec3 uLight;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uDeep;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vObjPos;

void main() {
  // Construção de baixo para cima, com borda luminosa no corte
  float cut = mix(-2.4, 2.4, uBuild);
  float wave = sin(vObjPos.x * 6.0 + uTime) * 0.04 + sin(vObjPos.z * 9.0 - uTime * 1.3) * 0.03;
  float edgeDist = (cut + wave) - vObjPos.y;
  if (edgeDist < 0.0) discard;
  float edge = smoothstep(0.12, 0.0, edgeDist) * (1.0 - step(0.999, uBuild));

  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  if (!gl_FrontFacing) N = -N;
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 2.4);

  // Película iridescente: o tom muda com o ângulo de visão
  vec3 phase = vec3(0.0, 0.33, 0.67) + fres * 1.4 + dot(N, vec3(0.35, 0.6, 0.2)) * 0.6 + uTime * 0.03;
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * phase);
  vec3 tint = mix(uColorA, uColorB, irid.x);
  tint = mix(tint, uColorC, irid.z * 0.45);

  // Reflexo de estúdio: faixas de luz suaves no ambiente
  vec3 R = reflect(-V, N);
  float bands = smoothstep(0.55, 1.0, sin(R.y * 5.0 + R.x * 2.0 + 1.2)) * 0.6
              + smoothstep(0.85, 1.0, sin(R.x * 7.0 - R.z * 3.0)) * 0.4;

  // Luz principal segue o cursor
  vec3 L = normalize(uLight);
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(R, L), 0.0), mix(18.0, 64.0, uPolish));

  // Interior: vidro escuro tingido, nunca preto puro
  vec3 body = mix(uDeep, tint * 0.45, 0.35 + 0.25 * irid.y);
  vec3 col = body * (0.45 + diff * 0.75);
  col += tint * fres * mix(0.9, 2.2, uPolish);
  col += mix(uColorA, uColorC, irid.y) * bands * 0.7 * uPolish;
  col += vec3(1.0) * spec * mix(0.5, 1.4, uPolish);
  col += uColorA * edge * 2.5;

  // Antes de polida, a superfície mostra uma grade técnica
  vec3 g = abs(fract(vObjPos * 6.0) - 0.5);
  float grid = smoothstep(0.47, 0.5, max(max(g.x, g.y), g.z));
  col += uColorA * grid * 0.35 * (1.0 - uPolish);

  float alpha = mix(0.85, 0.97, uPolish) * uOpacity;
  gl_FragColor = vec4(col, alpha);
}
`;
