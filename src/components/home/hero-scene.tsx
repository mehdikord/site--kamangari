"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { Color, MathUtils, Vector3 } from "three";
import { EXPLODE, createQalyan } from "@/three/qalyan";
import { createSmoke } from "@/three/smoke";
import { createStage } from "@/three/stage";
import { HERO_PARTS } from "./hero-parts";

interface Props {
  progress: MotionValue<number>;
  labels: React.RefObject<(HTMLElement | null)[]>;
  onReady: () => void;
}

const { smoothstep, lerp } = MathUtils;
const INTRO_SECONDS = 1.4;
const COOL = new Color("#3d7bff");
const HOT = new Color("#ff5a2c");

export default function HeroScene({ progress, labels, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const stage = createStage(el);
    if (!stage) return;

    const { renderer, scene, camera } = stage;
    const model = createQalyan();
    const smoke = createSmoke();
    scene.add(model.root, smoke.mesh);

    let width = 0;
    let height = 0;
    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(el);

    let pointerX = 0;
    let turn = 0;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") pointerX = event.clientX / window.innerWidth - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const focal = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2));
    const point = new Vector3();
    const accent = new Color();
    let frame = 0;
    let start = 0;
    let announced = false;

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!width || !height) return;
      if (!start) start = now;
      const time = (now - start) / 1000;

      // the parts drop into place on load, then scroll takes them apart and lights them
      const intro = Math.min(time / INTRO_SECONDS, 1);
      const falling = Math.pow(1 - intro, 4);
      const p = progress.get();
      const apart = smoothstep(p, 0.1, 0.38) * (1 - smoothstep(p, 0.64, 0.84));
      const lit = smoothstep(p, 0.82, 0.96);
      const amount = Math.max(falling * 0.75, apart);

      model.explode(amount);
      model.bubble(time);
      model.accent(accent.lerpColors(COOL, HOT, lit));
      model.glow(0.75 + lit * 1.5 + Math.sin(time * 3.1) * 0.12);

      turn = lerp(turn, pointerX * 0.45, 0.05);
      const rotation = -0.22 + turn + Math.sin(p * Math.PI * 2) * 0.32 - falling * 0.9;
      model.root.rotation.y = rotation;

      const low = lerp(-0.6, -1.4, amount);
      const high = lerp(5.6, 6.35, amount);
      const span = lerp(3.5, 4.9, amount);
      const distance = Math.max((high - low) / focal, span / (focal * camera.aspect)) * lerp(1.04, 1, lit);
      const middle = (high + low) / 2;
      const centerX = lerp(0.35, 0.75, amount);
      camera.position.set(centerX, middle + distance * 0.1, distance);
      camera.lookAt(centerX, middle, 0);
      camera.updateMatrixWorld();

      smoke.mesh.position.set(0, 4.56 + EXPLODE.coals[1] * amount, 0);
      smoke.update(time, (0.75 + lit * 0.7) * (1 - amount) * intro, camera);

      for (let i = 0; i < HERO_PARTS.length; i++) {
        const label = labels.current[i];
        if (!label) continue;
        const part = HERO_PARTS[i];
        const offset = EXPLODE[part.id];
        point.set(part.anchor[0] + offset[0] * amount, part.anchor[1] + offset[1] * amount, part.anchor[2] + offset[2] * amount);
        point.applyAxisAngle(camera.up, rotation).project(camera);
        const x = (point.x * 0.5 + 0.5) * width;
        const y = (0.5 - point.y * 0.5) * height;
        label.style.transform = `translate(${x}px, ${y}px) translate(${part.side === "left" ? "-100%" : "0"}, -50%)`;
      }

      renderer.render(scene, camera);
      if (!announced) {
        announced = true;
        onReady();
      }
    };

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(render);
    });
    visibility.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      model.dispose();
      smoke.dispose();
      stage.dispose();
    };
  }, [progress, labels, onReady]);

  return <div ref={host} className="absolute inset-0" />;
}
