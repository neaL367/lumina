import { getPhotos } from "@/lib/photos";
import { Carousel, CarouselMain } from "@/components/carousel";

export default async function PhotoModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const photos = await getPhotos();

  return (
    <Carousel photos={photos}>
      {children}
      <CarouselMain />
    </Carousel>
  );
}
