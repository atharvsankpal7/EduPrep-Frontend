"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getRenderableContent } from "@/lib/test-engine/content";

interface RenderableContentProps {
  value: string;
  altText: string;
  className?: string;
  imageClassName?: string;
}

function RenderableContentComponent({
  value,
  altText,
  className,
  imageClassName,
}: RenderableContentProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const content = useMemo(() => getRenderableContent(value), [value]);

  useEffect(() => {
    setImageFailed(false);
  }, [value]);

  if (content.kind === "text") {
    return <span className={cn("text-pretty", className)}>{value}</span>;
  }

  if (imageFailed) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        Image failed to load.
      </span>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Image
        src={content.value}
        alt={altText}
        width={960}
        height={540}
        className={cn(
          "h-auto max-h-80 w-full rounded-md border border-border bg-muted object-contain",
          imageClassName
        )}
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}

export const RenderableContent = memo(RenderableContentComponent);
