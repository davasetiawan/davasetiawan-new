"use client";

import SectionBadge from "./SectionBadge";
import DriftWall from "./DriftWall";
import { useMemo } from "react";
import { useData } from "../lib/store";

export default function GalleryDrift() {
  const data = useData();
  const rawGallery = data?.gallery;
  const galleryItems = useMemo(() => {
    return rawGallery && rawGallery.length > 0 ? rawGallery : [];
  }, [JSON.stringify(rawGallery)]);

  return (
    <section id="gallery" className="mx-auto w-full max-w-[1536px] px-6 md:px-12 relative z-10 py-20 md:py-24 flex flex-col items-center justify-center">
      <div className="mb-12 flex w-full flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <SectionBadge text="Visual Showcase" align="left" />
          <h2 className="font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
            Gallery
          </h2>
        </div>
        
      </div>

      <div className="relative h-[650px] w-full flex items-center justify-center overflow-hidden">
        {galleryItems.length > 0 ? (
          <DriftWall
            items={galleryItems}
            columns={5}
            tileWidth={230}
            tileHeight={150}
            gap={16}
            radius={16}
            tilt={0}
            turn={0}
            perspective={1200}
            depth={0}
            speed={32}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={40}
            fade={0.35}
            dim={0.75}
            grayscale={true}
            fit="cover"
            overlayColor="transparent"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center text-[var(--muted-foreground)]">
            Belum ada foto di galeri. Silakan tambahkan lewat Admin CMS.
          </div>
        )}
      </div>
    </section>
  );
}
