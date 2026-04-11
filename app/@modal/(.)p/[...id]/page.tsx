import { notFound } from "next/navigation";
import { CarouselMain } from "@/components/carousel";

export default async function PhotoModal(props: PageProps<"/p/[...id]">) {
  const { id } = await props.params;
  if (!id) return notFound();

  return <CarouselMain />;
}
