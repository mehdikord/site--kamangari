import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { woodMap } from "./textures";

export type BaseShape = "sphere" | "cone" | "facet";
export type StemKind = "steel" | "black" | "champagne" | "wood" | "blue";

export interface QalyanOptions {
  shape: BaseShape;
  stem: StemKind;
  glass: string;
  hose: string;
  bowl: string;
}

export const DEFAULT_QALYAN: QalyanOptions = {
  shape: "cone",
  stem: "steel",
  glass: "#3d7bff",
  hose: "#20232a",
  bowl: "#20232a",
};

export type PartName = "base" | "stem" | "tray" | "bowl" | "coals" | "hose";

/** How far each part travels when the model is fully taken apart. */
export const EXPLODE: Record<PartName, [number, number, number]> = {
  base: [0, -0.8, 0],
  stem: [0, 0.1, 0],
  tray: [0, 0.6, 0],
  bowl: [0, 1, 0],
  coals: [0, 1.5, 0],
  hose: [1, -0.15, 0],
};

const FINISH: Record<Exclude<StemKind, "wood">, [color: string, roughness: number]> = {
  steel: ["#d9dee5", 0.2],
  black: ["#262930", 0.3],
  champagne: ["#d8c3a0", 0.22],
  blue: ["#2f5fd0", 0.24],
};

export function metal(kind: Exclude<StemKind, "wood">) {
  const [color, roughness] = FINISH[kind];
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 1 });
}

const softTouch = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.48, clearcoat: 0.25, side: THREE.DoubleSide });

/** Revolve a profile given as [radius, height] pairs; `smooth` rounds it with a spline. */
export function lathe(profile: number[][], material: THREE.Material, smooth = true, segments = 80) {
  const raw = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const points = smooth ? new THREE.SplineCurve(raw).getPoints(profile.length * 7) : raw;
  for (const p of points) p.x = Math.max(p.x, 0.0001);
  const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, segments), material);
  mesh.castShadow = true;
  return mesh;
}

/** A machined cylinder with small chamfers at both ends. */
export function cylinder(radius: number, from: number, to: number, material: THREE.Material, chamfer = 0.018) {
  return lathe([[0, from], [radius - chamfer, from], [radius, from + chamfer], [radius, to - chamfer], [radius - chamfer, to], [0, to]], material, false);
}

export function ring(radius: number, tube: number, y: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 14, 72), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  mesh.castShadow = true;
  return mesh;
}

/*
 * Real transmission needs an opaque backdrop and our canvases are transparent,
 * so the glass raises its own alpha at glancing angles and on highlights.
 */
function tintedGlass(color: string, body: number, faceted: boolean) {
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    transparent: true,
    depthWrite: false,
    flatShading: faceted,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `float edge = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.0);
       float shine = smoothstep(0.35, 1.1, dot(outgoingLight, vec3(0.299, 0.587, 0.114)));
       diffuseColor.a = clamp(${body.toFixed(2)} + edge * 0.6 + shine * 0.7, 0.0, 0.97);
       #include <opaque_fragment>`,
    );
  };
  material.customProgramCacheKey = () => `glass-${body}`;
  return material;
}

const SHAPES: Record<BaseShape, number[][]> = {
  sphere: [[0.56, 0.1], [0.8, 0.22], [0.93, 0.5], [0.92, 0.82], [0.75, 1.14], [0.44, 1.34], [0.28, 1.46], [0.25, 1.62], [0.25, 1.74]],
  cone: [[0.84, 0.1], [0.97, 0.15], [0.97, 0.28], [0.75, 0.6], [0.5, 0.98], [0.32, 1.3], [0.25, 1.48], [0.25, 1.74]],
  facet: [[0.66, 0.1], [0.82, 0.26], [0.84, 0.5], [0.74, 0.92], [0.46, 1.3], [0.28, 1.5], [0.25, 1.74]],
};
const WATER_LEVEL = 0.8;

function waterProfile(profile: number[][]) {
  const inner = [[0, 0.16], [profile[0][0] * 0.92, 0.17]];
  for (let i = 1; i < profile.length; i++) {
    const [r, y] = profile[i];
    const [previousR, previousY] = profile[i - 1];
    if (y >= WATER_LEVEL) {
      const t = (WATER_LEVEL - previousY) / (y - previousY);
      inner.push([(previousR + (r - previousR) * t) * 0.92, WATER_LEVEL]);
      break;
    }
    inner.push([r * 0.92, y]);
  }
  inner.push([0, WATER_LEVEL]);
  return inner;
}

export function buildBase(shape: BaseShape, color: string) {
  const group = new THREE.Group();
  const faceted = shape === "facet";
  const segments = faceted ? 11 : 112;
  const profile = SHAPES[shape];
  const foot = profile[0][0];

  const tint = new THREE.Color(color).lerp(new THREE.Color("#2a2e38"), 0.35);
  const backWall = tintedGlass(`#${tint.getHexString()}`, 0.26, faceted);
  backWall.side = THREE.BackSide;
  const frontWall = tintedGlass(`#${tint.getHexString()}`, 0.14, faceted);

  const water = new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 0.32, roughness: 0.2, transparent: true, opacity: 0.86, depthWrite: false, flatShading: faceted });
  water.name = "accent";
  const light = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.2, roughness: 0.4 });
  light.name = "accent";

  // painted back to front: far wall, water, bubbles, near wall
  const back = lathe(profile, backWall, !faceted, segments);
  const liquid = lathe(waterProfile(profile), water, false, segments);
  const front = lathe(profile, frontWall, !faceted, segments);
  back.renderOrder = 1;
  liquid.renderOrder = 2;
  front.renderOrder = 4;
  liquid.castShadow = false;

  const bubbleMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.4, depthWrite: false });
  const bubbleGeometry = new THREE.SphereGeometry(1, 10, 8);
  for (let i = 0; i < 18; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    const angle = i * 2.4;
    const spread = 0.12 + ((i * 7) % 10) * 0.035;
    bubble.name = "bubble";
    bubble.position.set(Math.cos(angle) * spread, 0.22 + ((i * 0.173) % 0.54), Math.sin(angle) * spread);
    bubble.scale.setScalar(0.014 + (i % 4) * 0.007);
    bubble.renderOrder = 3;
    group.add(bubble);
  }

  const dark = metal("black");
  group.add(back, liquid, front);
  group.add(cylinder(foot + 0.05, 0, 0.1, dark));
  group.add(ring(foot + 0.052, 0.016, 0.07, light));
  group.add(cylinder(0.275, 1.63, 1.77, metal("steel")));
  return group;
}

export function buildStem(kind: StemKind) {
  const group = new THREE.Group();
  const steel = metal(kind === "black" ? "black" : "steel");
  const sleeve = kind === "wood" ? new THREE.MeshPhysicalMaterial({ map: woodMap(), roughness: 0.34, clearcoat: 0.6 }) : metal(kind);
  const grip = softTouch("#17191e");

  group.add(cylinder(0.075, 0.36, 1.66, steel)); // down-stem, seen through the glass
  group.add(cylinder(0.11, 0.3, 0.44, grip));
  group.add(cylinder(0.22, 1.72, 1.8, grip));
  group.add(cylinder(0.31, 1.78, 2.06, steel, 0.035));
  group.add(cylinder(0.315, 1.9, 1.94, grip, 0.008));
  group.add(cylinder(0.13, 2.04, 3.66, steel));
  group.add(cylinder(0.19, 2.22, 3.28, sleeve, 0.03));
  group.add(cylinder(0.195, 2.22, 2.3, steel));
  group.add(cylinder(0.195, 3.2, 3.28, steel));
  for (let i = 0; i < 4; i++) group.add(ring(0.133, 0.012, 3.4 + i * 0.05, steel));

  for (const side of [1, -1]) {
    const port = side > 0 ? cylinder(0.092, 0, 0.3, steel) : cylinder(0.07, 0, 0.16, steel);
    port.position.set(side * 0.24, 1.92, 0);
    port.rotation.z = -side * (Math.PI / 2 - (side > 0 ? 0.35 : 0));
    group.add(port);
  }
  return group;
}

export function buildTray(kind: StemKind) {
  const group = new THREE.Group();
  const material = metal(kind === "black" ? "black" : "steel");
  material.side = THREE.DoubleSide;
  group.add(lathe([[0.1, 3.67], [0.5, 3.67], [0.66, 3.685], [0.74, 3.72], [0.77, 3.76], [0.755, 3.765], [0.72, 3.735], [0.64, 3.71], [0.5, 3.7], [0.1, 3.7]], material, false));
  return group;
}

export function buildBowl(color: string) {
  const group = new THREE.Group();
  const body = softTouch(color);
  group.add(lathe([[0, 3.7], [0.115, 3.7], [0.13, 3.72], [0.13, 3.88], [0.15, 3.93], [0.3, 4.05], [0.355, 4.11], [0.37, 4.17], [0.37, 4.31], [0.355, 4.335], [0.31, 4.335], [0.29, 4.29]], body, false));
  group.add(lathe([[0.29, 4.29], [0, 4.27]], body, false));
  group.add(cylinder(0.376, 4.21, 4.235, metal("steel"), 0.006));
  return group;
}

/** The metal heat controller with the coals inside it. */
export function buildCoals() {
  const group = new THREE.Group();
  const steel = metal("steel");
  steel.side = THREE.DoubleSide;

  const ember = new THREE.MeshStandardMaterial({ color: "#2a211e", roughness: 0.95, emissive: "#ff4a12", emissiveIntensity: 0.9 });
  ember.name = "ember";
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  for (let i = 0; i < 520; i++) {
    const v = (i * 71) % 255;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect((i * 53) % 128, (i * 97) % 128, 3 + (i % 7), 3 + (i % 5));
  }
  ember.emissiveMap = new THREE.CanvasTexture(canvas);

  const cube = new RoundedBoxGeometry(0.23, 0.21, 0.23, 2, 0.03);
  for (const [x, z, turn] of [[0, 0.15, 0.2], [-0.15, -0.09, 0.9], [0.15, -0.1, 1.5]]) {
    const coal = new THREE.Mesh(cube, ember);
    coal.position.set(x, 4.48, z);
    coal.rotation.y = turn;
    coal.castShadow = true;
    group.add(coal);
  }

  group.add(lathe([[0, 4.345], [0.37, 4.345], [0.39, 4.37], [0.39, 4.4]], steel, false));
  group.add(ring(0.385, 0.022, 4.54, steel));
  const post = new THREE.BoxGeometry(0.035, 0.15, 0.02);
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const mesh = new THREE.Mesh(post, steel);
    mesh.position.set(Math.sin(a) * 0.385, 4.465, Math.cos(a) * 0.385);
    mesh.rotation.y = a;
    group.add(mesh);
  }
  const tab = cylinder(0.04, 0, 0.26, softTouch("#17191e"));
  tab.position.set(-0.38, 4.52, 0);
  tab.rotation.z = Math.PI / 2 - 0.25;
  group.add(tab);
  return group;
}

export function buildHose(color: string) {
  const group = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3(
    [[0.5, 2.02, 0], [0.86, 2.14, 0.03], [1.24, 1.8, 0.12], [1.36, 0.95, 0.35], [1.24, 0.22, 0.7], [1.52, 0.13, 0.92], [1.78, 0.44, 0.7], [1.72, 1.2, 0.42], [1.6, 1.62, 0.32]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal",
  );
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, 0.07, 16), softTouch(color));
  tube.castShadow = true;

  const steel = metal("steel");
  const handle = new THREE.Group();
  handle.add(
    cylinder(0.088, -0.02, 0.1, steel),
    cylinder(0.085, 0.1, 0.62, softTouch("#17191e")),
    cylinder(0.088, 0.62, 0.68, steel),
    lathe([[0.068, 0.68], [0.06, 0.9], [0.04, 1.2], [0.036, 1.24], [0, 1.245]], steel, false),
  );
  handle.position.copy(curve.getPoint(1));
  handle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(1));
  group.add(tube, handle);
  return group;
}

export function createQalyan(options: Partial<QalyanOptions> = {}) {
  const o = { ...DEFAULT_QALYAN, ...options };
  const root = new THREE.Group();
  const parts: Record<PartName, THREE.Group> = {
    base: buildBase(o.shape, o.glass),
    stem: buildStem(o.stem),
    tray: buildTray(o.stem),
    bowl: buildBowl(o.bowl),
    coals: buildCoals(),
    hose: buildHose(o.hose),
  };
  const names = Object.keys(parts) as PartName[];
  for (const name of names) root.add(parts[name]);

  let ember: THREE.MeshStandardMaterial | undefined;
  const accents = new Set<THREE.MeshStandardMaterial>();
  const bubbles: THREE.Object3D[] = [];
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (child.name === "bubble") bubbles.push(child);
    if (child.material.name === "accent") accents.add(child.material);
    if (child.material.name === "ember") ember = child.material;
  });
  const accentList = [...accents];

  return {
    root,
    parts,
    explode(amount: number) {
      for (let i = 0; i < names.length; i++) {
        const [x, y, z] = EXPLODE[names[i]];
        parts[names[i]].position.set(x * amount, y * amount, z * amount);
      }
    },
    glow(value: number) {
      if (ember) ember.emissiveIntensity = value;
    },
    /** Recolours the water and the light ring. */
    accent(color: THREE.Color) {
      for (let i = 0; i < accentList.length; i++) {
        accentList[i].color.copy(color);
        accentList[i].emissive.copy(color);
      }
    },
    bubble(time: number) {
      for (let i = 0; i < bubbles.length; i++) bubbles[i].position.y = 0.22 + ((time * (0.14 + (i % 5) * 0.035) + i * 0.173) % 0.54);
    },
    dispose() {
      disposeObject(root);
    },
  };
}

export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
      material.dispose();
    }
  });
}
