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
  setLoading: (loading: boolean) => void;
  handleNext: () => void;
  handlePrev: () => void;
  closeModal: () => void;
  goToIndex: (index: number) => void;
  direction: "next" | "prev" | null;
  isNavigatingRef: React.RefObject<boolean | null>;
  pendingIndexRef: React.RefObject<number | null>;
};