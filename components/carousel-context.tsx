"use client";

import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useTransition,
} from "react";
import type { CarouselContextType, PhotoProps } from "@/utils/types";
import { getPhotoHref, getPhotoIdFromRouteParam, getPhotoIndexFromRouteParam } from "@/utils/photo-paths";
import { getCloudinaryAssetPath, getCloudinaryImageUrl } from "@/lib/cloudinary-images";

type CarouselState = {
  currentIndex: number;
  settledIndex: number;
  direction: "next" | "prev" | null;
};

type CarouselAction =
  | { type: "go-to"; index: number }
  | { type: "sync-route"; index: number }
  | { type: "mark-loaded"; index: number };

const CarouselContext = createContext<CarouselContextType | null>(null);

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case "go-to":
    case "sync-route":
      if (action.index === state.currentIndex) {
        return state;
      }

      return {
        ...state,
        currentIndex: action.index,
        direction: action.index > state.currentIndex ? "next" : "prev",
      };

    case "mark-loaded":
      if (action.index !== state.currentIndex || action.index === state.settledIndex) {
        return state;
      }

      return {
        ...state,
        settledIndex: action.index,
      };

    default:
      return state;
  }
}

export function useCarousel() {
  const context = use(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel root");
  }
  return context;
}

export function CarouselProvider(props: {
  children: React.ReactNode;
  photos: PhotoProps[];
}) {
  const router = useRouter();
  const params = useParams();
  const currentParamId = getPhotoIdFromRouteParam(params?.id);
  const routeIndex = getPhotoIndexFromRouteParam(params?.id, props.photos);
  const [state, dispatch] = useReducer(carouselReducer, {
    currentIndex: routeIndex,
    settledIndex: routeIndex,
    direction: null,
  });
  const [, startTransition] = useTransition();
  const currentIndexRef = useRef(routeIndex);
  const lastParamIdRef = useRef(currentParamId);
  const lastRequestedIndexRef = useRef(routeIndex);
  const pendingRouteIndicesRef = useRef<Set<number>>(new Set());
  const loadedPhotoIdsRef = useRef<Set<string>>(new Set());
  const preloadingPhotoIdsRef = useRef<Set<string>>(new Set());
  const loading = state.settledIndex !== state.currentIndex;
  const photoIndexById = useMemo(() => {
    return new Map(props.photos.map((photo, index) => [photo.id, index]));
  }, [props.photos]);

  const preloadPhoto = useCallback(
    (photo: PhotoProps | undefined) => {
      if (typeof window === "undefined" || !photo) {
        return;
      }

      if (loadedPhotoIdsRef.current.has(photo.id) || preloadingPhotoIdsRef.current.has(photo.id)) {
        return;
      }

      preloadingPhotoIdsRef.current.add(photo.id);

      const image = new window.Image();
      image.decoding = "async";
      image.src = getCloudinaryImageUrl(
        getCloudinaryAssetPath(photo.public_id, photo.format),
        {
          width: 1920,
        }
      );

      const finalize = () => {
        preloadingPhotoIdsRef.current.delete(photo.id);
        loadedPhotoIdsRef.current.add(photo.id);

        const photoIndex = photoIndexById.get(photo.id);
        if (photoIndex !== undefined && photoIndex === currentIndexRef.current) {
          dispatch({ type: "mark-loaded", index: photoIndex });
        }
      };

      image.onload = finalize;
      image.onerror = finalize;
    },
    [photoIndexById]
  );

  useEffect(() => {
    currentIndexRef.current = state.currentIndex;
  }, [state.currentIndex]);

  useEffect(() => {
    const currentPhoto = props.photos[state.currentIndex];
    if (!currentPhoto) {
      return;
    }

    if (loadedPhotoIdsRef.current.has(currentPhoto.id)) {
      dispatch({ type: "mark-loaded", index: state.currentIndex });
      return;
    }

    preloadPhoto(currentPhoto);

    const adjacentIndices = [
      state.currentIndex - 2,
      state.currentIndex - 1,
      state.currentIndex + 1,
      state.currentIndex + 2,
    ];

    adjacentIndices.forEach((index) => {
      const photo = props.photos[index];
      if (!photo) {
        return;
      }

      router.prefetch(getPhotoHref(photo.id));
      preloadPhoto(photo);
    });
  }, [state.currentIndex, props.photos, preloadPhoto, router]);

  useEffect(() => {
    if (currentParamId === lastParamIdRef.current) {
      return;
    }

    lastParamIdRef.current = currentParamId;

    if (pendingRouteIndicesRef.current.has(routeIndex)) {
      if (routeIndex === lastRequestedIndexRef.current) {
        pendingRouteIndicesRef.current.clear();
      } else {
        pendingRouteIndicesRef.current.delete(routeIndex);
      }
      return;
    }

    dispatch({ type: "sync-route", index: routeIndex });
  }, [currentParamId, routeIndex]);

  const markCurrentImageLoaded = useCallback((index: number) => {
    const currentPhoto = props.photos[index];
    if (currentPhoto) {
      loadedPhotoIdsRef.current.add(currentPhoto.id);
      preloadingPhotoIdsRef.current.delete(currentPhoto.id);
    }
    dispatch({ type: "mark-loaded", index });
  }, [props.photos]);

  const closeModal = useCallback(() => {
    router.back();
  }, [router]);

  const goToIndex = useCallback(
    (newIndex: number) => {
      const nextPhoto = props.photos[newIndex];
      if (!nextPhoto || newIndex === currentIndexRef.current) {
        return;
      }

      currentIndexRef.current = newIndex;
      lastRequestedIndexRef.current = newIndex;
      pendingRouteIndicesRef.current.add(newIndex);
      dispatch({ type: "go-to", index: newIndex });

      if (loadedPhotoIdsRef.current.has(nextPhoto.id)) {
        dispatch({ type: "mark-loaded", index: newIndex });
      } else {
        preloadPhoto(nextPhoto);
      }

      startTransition(() => {
        router.replace(getPhotoHref(nextPhoto.id), { scroll: false });
      });
    },
    [preloadPhoto, props.photos, router, startTransition]
  );

  const handleNext = useCallback(() => {
    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex < props.photos.length) {
      goToIndex(nextIndex);
    }
  }, [props.photos.length, goToIndex]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndexRef.current - 1;
    if (prevIndex >= 0) {
      goToIndex(prevIndex);
    }
  }, [goToIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === `ArrowRight`) handleNext();
      if (event.key === `ArrowLeft`) handlePrev();
      if (event.key === `Escape`) closeModal();
    };

    window.addEventListener(`keydown`, onKeyDown);
    return () => window.removeEventListener(`keydown`, onKeyDown);
  }, [handleNext, handlePrev, closeModal]);

  const contextValue = useMemo(
    () => ({
      currentIndex: state.currentIndex,
      settledIndex: state.settledIndex,
      photos: props.photos,
      loading,
      markCurrentImageLoaded,
      handleNext,
      handlePrev,
      closeModal,
      goToIndex,
      direction: state.direction,
    }),
    [
      state.currentIndex,
      state.settledIndex,
      props.photos,
      loading,
      markCurrentImageLoaded,
      handleNext,
      handlePrev,
      closeModal,
      goToIndex,
      state.direction,
    ]
  );

  return <CarouselContext.Provider value={contextValue}>{props.children}</CarouselContext.Provider>;
}
