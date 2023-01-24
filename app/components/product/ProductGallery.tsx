import { MediaFile } from "@shopify/storefront-kit-react";
import type { MediaEdge } from "@shopify/storefront-kit-react/storefront-api-types";
import { ATTR_LOADING_EAGER } from "~/lib/const";

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({ media, className }: ProductGalleryProps) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane hidden-scroll md:grid-flow-row md:grid-cols-2 md:overflow-x-auto md:p-0 ${className}`}
    >
      {media.map((m, i) => {
        let mediaProps: Record<string, any> = {};
        const isFirst = i === 0;
        const isFourth = i === 3;
        const isFullWidth = i % 3 === 0;

        const data = {
          ...m,
          image: {
            ...(m.__typename === "MediaImage" && { ...m.image }),
            altText: m.alt || "product image",
          },
        };

        switch (m.mediaContentType) {
          case "IMAGE":
            mediaProps = {
              width: 800,
              widths: [400, 800, 1200, 1600, 2000, 2400],
            };
            break;
          case "VIDEO":
            mediaProps = {
              loop: true,
              width: "100%",
              muted: true,
              preload: "auto",
              autoPlay: true,
              controls: false,
            };
            break;
          case "EXTERNAL_VIDEO":
            mediaProps = { width: "100%" };
            break;
          case "MODEL_3D":
            mediaProps = {
              ar: true,
              width: "100%",
              disableZoom: true,
              loading: ATTR_LOADING_EAGER,
              interactionPromptThreshold: "0",
            };
            break;
        }

        if (i === 0 && m.mediaContentType === "IMAGE") {
          mediaProps.loading = ATTR_LOADING_EAGER;
        }

        const style = [
          isFullWidth ? "md:col-span-2" : "md:col-span-1",
          isFirst || isFourth ? "" : "md:aspect-[4/5]",
          "snap-center card-image w-mobile-gallery md:w-full",
        ].join(" ");

        return (
          <div className={style} key={m.id}>
            <MediaFile
              tabIndex={0}
              className={`fade-in aspect-square h-full w-full object-cover`}
              data={data}
            />
          </div>
        );
      })}
    </div>
  );
}

type ProductGalleryProps = {
  media: MediaEdge["node"][];
  className?: string;
};
