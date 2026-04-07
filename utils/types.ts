export interface PhotoProps {
  id: string;
  height: number;
  width: number;
  public_id: string;
  format: string;
  blurDataUrl?: string;
}

export type CarouselContextType = {
  currentIndex: number;
  photos: PhotoProps[];
  loading: boolean;
  markCurrentImageLoaded: (imageId: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
  closeModal: () => void;
  goToIndex: (index: number) => void;
  direction: "next" | "prev" | null;
  isNavigatingRef: { current: boolean };
  pendingIndexRef: { current: number | null };
};
