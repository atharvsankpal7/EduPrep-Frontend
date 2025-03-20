import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const PLACEMENT_IMAGES = [
  {
    id: 1,
    source: "/placements/1.jpg",
  },
  {
    id: 3,
    source: "/placements/3.jpg",
  },
  {
    id: 4,
    source: "/placements/4.jpg",
  },
  {
    id: 5,
    source: "/placements/5.jpg",
  },
  {
    id: 6,
    source: "/placements/6.jpg",
  },
  {
    id: 7,
    source: "/placements/7.jpg",
  },
  {
    id: 8,
    source: "/placements/8.jpg",
  },
  {
    id: 9,
    source: "/placements/9.jpg",
  },
  {
    id: 10,
    source: "/placements/10.jpg",
  },
  {
    id: 11,
    source: "/placements/11.jpg",
  },
  {
    id: 12,
    source: "/placements/12.jpg",
  },
  {
    id: 13,
    source: "/placements/13.jpg",
  },
  {
    id: 14,
    source: "/placements/14.jpg",
  },
  {
    id: 15,
    source: "/placements/15.jpg",
  },
  {
    id: 16,
    source: "/placements/16.jpg",
  },
  {
    id: 17,
    source: "/placements/17.jpg",
  },
  {
    id: 18,
    source: "/placements/18.jpg",
  },
  {
    id: 19,
    source: "/placements/19.jpg",
  },
];

export default function Placements() {
  return (
    <div className="container mx-auto py-8">
      <ScrollArea className="h-full w-full">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-3">
              Our Placements
            </h1>
            <p className="text-muted-foreground">
              Empowering careers through excellence in education and industry
              partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLACEMENT_IMAGES.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src={image.source}
                    alt={`Placement ${image.id}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
