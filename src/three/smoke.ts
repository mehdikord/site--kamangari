import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }
  void main() {
    float y = vUv.y;
    vec2 p = vec2((vUv.x - 0.5) * 5.0, y * 4.2 - uTime * 0.42);
    float warp = fbm(p * 0.8);
    float sway = (fbm(vec2(y * 2.2 - uTime * 0.17, 4.0)) - 0.47) * 0.5 * smoothstep(0.0, 0.5, y);
    float width = mix(0.045, 0.36, y);
    float x = abs(vUv.x - 0.5 - sway);
    float body = exp(-pow(x / width, 2.0) * 1.8);
    float n = fbm(p + vec2(warp * 3.2, warp * 1.1));
    float wisps = 1.0 - smoothstep(0.0, 0.16, abs(n - 0.48));
    float fade = smoothstep(0.0, 0.1, y) * (1.0 - smoothstep(0.45, 1.0, y));
    float edge = smoothstep(0.0, 0.14, vUv.x) * smoothstep(0.0, 0.14, 1.0 - vUv.x);
    float alpha = body * fade * edge * (0.22 * n + 0.48 * wisps) * uStrength;
    gl_FragColor = vec4(vec3(0.82, 0.88, 0.98), alpha);
  }`;

export function createSmoke() {
  const uniforms = { uTime: { value: 0 }, uStrength: { value: 1 } };
  const geometry = new THREE.PlaneGeometry(2.2, 3.2);
  geometry.translate(0, 1.6, 0);
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false });
  const mesh = new THREE.Mesh(geometry, material);
  return {
    mesh,
    update(time: number, strength: number, camera: THREE.Camera) {
      uniforms.uTime.value = time;
      uniforms.uStrength.value = strength;
      mesh.rotation.y = Math.atan2(camera.position.x - mesh.position.x, camera.position.z - mesh.position.z);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
