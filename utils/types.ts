export interface PhotoProps {
  id: string;
  height: number;
  width: number;
  public_id: string;
  format: string;
  createdAt?: string;
  blurDataUrl?: string;
}

export type CarouselContextType = {
  currentIndex: number;
  settledIndex: number;
  photos: PhotoProps[];
  loading: boolean;
  markCurrentImageLoaded: (index: number) => void;
  handleNext: () => void;
  handlePrev: () => void;
  closeModal: () => void;
  goToIndex: (index: number) => void;
  direction: "next" | "prev" | null;
};
