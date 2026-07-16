import type { Keyframe } from "@/utils/types";

export const KEYFRAMES_DESKTOP: Keyframe[] = [
  { diff: -2.0, x: 84, y: 60, scale: 0.65, opacity: 0, rotate: 6 },
  { diff: -1.0, x: 42, y: 30, scale: 0.85, opacity: 0.25, rotate: 3 },
  { diff: 0.0, x: 0, y: 0, scale: 1.15, opacity: 1, rotate: 0 },
  { diff: 1.0, x: -42, y: -30, scale: 0.85, opacity: 0.3, rotate: -3 },
  { diff: 2.0, x: -84, y: -60, scale: 0.65, opacity: 0, rotate: -6 },
];

export const KEYFRAMES_MOBILE: Keyframe[] = [
  { diff: -2.0, x: 50, y: 70, scale: 0.65, opacity: 0, rotate: 4 },
  { diff: -1.0, x: 25, y: 35, scale: 0.85, opacity: 0.25, rotate: 2 },
  { diff: 0.0, x: 0, y: 0, scale: 1.12, opacity: 1, rotate: 0 },
  { diff: 1.0, x: -25, y: -35, scale: 0.85, opacity: 0.3, rotate: -2 },
  { diff: 2.0, x: -50, y: -70, scale: 0.65, opacity: 0, rotate: -4 },
];

export function getInterpolatedStyle(diff: number, isMobile = false) {
  const keyframes = isMobile ? KEYFRAMES_MOBILE : KEYFRAMES_DESKTOP;
  const absDiff = Math.abs(diff);

  if (diff <= keyframes[0].diff) {
    return {
      transform: `translate3d(calc(${keyframes[0].x}vw - 50%), calc(${keyframes[0].y}vh - 50%), 0) scale(${keyframes[0].scale}) rotate(${keyframes[0].rotate}deg)`,
      opacity: keyframes[0].opacity,
      pointerEvents: "none" as const,
      zIndex: 5,
    };
  }
  if (diff >= keyframes[keyframes.length - 1].diff) {
    const k = keyframes[keyframes.length - 1];
    return {
      transform: `translate3d(calc(${k.x}vw - 50%), calc(${k.y}vh - 50%), 0) scale(${k.scale}) rotate(${k.rotate}deg)`,
      opacity: k.opacity,
      pointerEvents: "none" as const,
      zIndex: 5,
    };
  }

  let k1 = keyframes[0];
  let k2 = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (diff >= keyframes[i].diff && diff <= keyframes[i + 1].diff) {
      k1 = keyframes[i];
      k2 = keyframes[i + 1];
      break;
    }
  }

  const t = (diff - k1.diff) / (k2.diff - k1.diff);
  const easeT = t * t * (3 - 2 * t);

  const x = k1.x + (k2.x - k1.x) * easeT;
  const y = k1.y + (k2.y - k1.y) * easeT;
  const scale = k1.scale + (k2.scale - k1.scale) * easeT;
  const opacity = k1.opacity + (k2.opacity - k1.opacity) * easeT;
  const rotate = k1.rotate + (k2.rotate - k1.rotate) * easeT;

  return {
    transform: `translate3d(calc(${x}vw - 50%), calc(${y}vh - 50%), 0) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    zIndex: Math.round((1 - absDiff) * 10) + 10,
    pointerEvents: absDiff > 0.5 ? ("none" as const) : ("auto" as const),
  };
}
