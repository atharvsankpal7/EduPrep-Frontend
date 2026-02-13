import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { testUi } from "@/components/test/test-design-system";

type TestSurfaceProps = ComponentPropsWithoutRef<"section"> & {
  muted?: boolean;
};

export function TestSurface({
  className,
  muted = false,
  ...props
}: TestSurfaceProps) {
  return (
    <section
      className={cn(muted ? testUi.surfaceMuted : testUi.surface, className)}
      {...props}
    />
  );
}
