import { getPhotos } from "@/lib/photos";
import { Carousel } from "@/components/carousel";

export default async function PhotoLayout(props: {
  children: React.ReactNode;
}) {
    const photos = await getPhotos();
    return <Carousel photos={photos}>{props.children}</Carousel>;
}
