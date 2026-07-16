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
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotate: number;
}
