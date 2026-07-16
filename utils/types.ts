export interface PhotoProps {
  publicId: string;
  height: number;
  width: number;
  format: string;
  createdAt?: string;
  blurDataUrl?: string;
}

export interface Keyframe {
  diff: number;
  x: number;      // translation in vw
  y: number;      // translation in vh
  scale: number;
  opacity: number;
  blur: number;   // CSS filter blur in px
  rotate: number; // rotation in deg
  grayscale: number; // grayscale amount in %
}
