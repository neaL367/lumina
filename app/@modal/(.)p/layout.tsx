import { getPhotos } from "@/lib/photos";
import { Carousel, CarouselMain } from "@/components/carousel";

export default async function PhotoModalLayout(props: {
  children: React.ReactNode
}) {
  const photos = await getPhotos();

  return (
    <Carousel photos={photos}>
      {props.children}
      <CarouselMain />
    </Carousel>
  );
}
