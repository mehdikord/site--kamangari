/** Sends a copy of the product image into whichever cart button is on screen. */
export function flyToCart(source: Element | null | undefined) {
  if (!(source instanceof HTMLImageElement) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = [...document.querySelectorAll("[data-cart-target]")].find((el) => el.getClientRects().length > 0);
  if (!target) return;

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = Math.min(from.width, 160);
  const startX = from.left + (from.width - size) / 2;
  const startY = from.top + (from.height - size) / 2;
  const dx = to.left + to.width / 2 - (startX + size / 2);
  const dy = to.top + to.height / 2 - (startY + size / 2);

  const ghost = document.createElement("img");
  ghost.src = source.currentSrc || source.src;
  ghost.alt = "";
  ghost.style.cssText = `position:fixed;left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;object-fit:contain;z-index:70;pointer-events:none`;
  document.body.appendChild(ghost);

  const flight = ghost.animate(
    [
      { transform: "none", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 70}px) scale(.7)`, opacity: 0.95, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0.3 },
    ],
    { duration: 620, easing: "cubic-bezier(.45,0,.2,1)" },
  );
  flight.onfinish = flight.oncancel = () => ghost.remove();
}
