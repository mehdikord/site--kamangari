import * as THREE from "three";

/** Small canvas helper: every texture in the project is drawn at runtime. */
export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

/** Straight, quiet walnut grain. */
export function woodMap(dark = "#3a2419", light = "#8a5a3a") {
  return canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = light;
    for (let i = 0; i < 170; i++) {
      const x = (i / 170) * 512;
      ctx.globalAlpha = 0.14 + ((i * 37) % 11) / 30;
      ctx.lineWidth = 0.8 + ((i * 13) % 5) / 3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + Math.sin(i) * 9, 170, x - Math.cos(i * 1.7) * 9, 340, x, 512);
      ctx.stroke();
    }
  });
}
