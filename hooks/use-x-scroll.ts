import { useEffect, RefObject } from "react";

export function useXScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { friction = 0.92, sensitivity = 0.8, minVelocity = 0.1 } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let velocity = 0;
    let rafId = 0;

    const animate = () => {
      if (Math.abs(velocity) < minVelocity) {
        velocity = 0;
        rafId = 0;
        return;
      }

      el.scrollLeft += velocity;
      velocity *= friction;
      rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      // If there is already a horizontal scroll component, let the browser handle it.
      // This is crucial for trackpads which provide native horizontal scrolling.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        velocity = 0;
        return;
      }

      e.preventDefault();

      const delta = e.deltaY;
      if (delta === 0) return;

      velocity += delta * sensitivity;
      if (!rafId) rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, [ref, friction, sensitivity, minVelocity]);
}
