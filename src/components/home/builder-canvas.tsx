"use client";

import { useEffect, useRef } from "react";
import { createQalyan, type QalyanOptions } from "@/three/qalyan";
import { createStage } from "@/three/stage";

export default function BuilderCanvas({ options, onReady }: { options: QalyanOptions; onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const apply = useRef<((next: QalyanOptions) => void) | null>(null);
  const latest = useRef(options);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const stage = createStage(el);
    if (!stage) return;
    const { renderer, scene, camera } = stage;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let model = createQalyan(latest.current);
    let swap = 0;
    scene.add(model.root);
    apply.current = (next) => {
      const replacement = createQalyan(next);
      replacement.root.rotation.copy(model.root.rotation);
      scene.remove(model.root);
      model.dispose();
      model = replacement;
      scene.add(model.root);
      swap = calm ? 0 : 1;
    };

    const resize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const distance = Math.max(5.3, 4.1 / camera.aspect) / 0.4987;
      camera.position.set(0, 2.36 + distance * 0.14, distance);
      camera.lookAt(0, 2.36, 0);
    };
    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(el);

    let dragX: number | null = null;
    let velocity = 0;
    let angle = -0.25;
    const down = (e: PointerEvent) => {
      dragX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragX === null) return;
      velocity = (e.clientX - dragX) * 0.009;
      angle += velocity;
      dragX = e.clientX;
    };
    const up = () => {
      dragX = null;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      angle += e.key === "ArrowRight" ? 0.25 : -0.25;
      e.preventDefault();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("keydown", key);

    let frame = 0;
    let previous = 0;
    let announced = false;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (dragX === null) {
        velocity *= 0.92;
        angle += velocity + (calm ? 0 : delta * 0.22);
      }
      swap = Math.max(0, swap - delta * 2.6);
      model.explode(Math.sin(swap * Math.PI) * 0.16);
      model.root.rotation.y = angle;
      renderer.render(scene, camera);
      if (!announced) {
        announced = true;
        onReady();
      }
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(render);
    });
    visibility.observe(el);

    return () => {
      apply.current = null;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizer.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("keydown", key);
      model.dispose();
      stage.dispose();
    };
  }, [onReady]);

  useEffect(() => {
    if (latest.current === options) return;
    latest.current = options;
    apply.current?.(options);
  }, [options]);

  return <div ref={host} tabIndex={0} role="img" aria-label="پیش‌نمایش سه‌بعدی قلیان؛ قابل چرخش با کشیدن یا کلیدهای چپ و راست" className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" />;
}
