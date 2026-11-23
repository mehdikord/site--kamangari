import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Returns null when WebGL is unavailable so callers can keep their poster image. */
export function createStage(host: HTMLElement, pixelRatio = Math.min(window.devicePixelRatio, 1.6)) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.62;
  room.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight("#fff0d4", 2.2);
  key.position.set(-4, 7, 6);
  const rim = new THREE.DirectionalLight("#6f9dff", 2.4);
  rim.position.set(5, 3, -5);
  scene.add(key, rim);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  return {
    renderer,
    scene,
    camera,
    key,
    dispose() {
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
