import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const REVIEWS = {
  parents: [
    'ZSFEZGdVHAI',
    'NBFW1qFKc1A',
    'fD1lcOp2lpM',
    'XFYGTKA0ZQ0',
    'WflmHiV58KA',
    'xPdV76cL7-I',
    '4be27bBe5lQ',
  ],
  alumni: [
    '92k5VVOM7r4',
    'rG7Ji4OkBfE',
    'iRqCrLBiO3U',
    'aXZSvRyKlbQ',
    'NRi4lxD4Ix4',
    'hzdKhggQ0hY',
    'BxMZfv7PKZk',
    'W_LEGpLktew',
    'PvbSAQNi8F4',
    '7zLpU7dJYos',
  ],
  faculty: [
    'Uas8Os85B-A',
    'SmRW7aClbds',
    'w66mrzFPntw',
    '_1uWRlbqmT4',
    'Z8NjVTrRYeI',
  ],
};

export default function Reviews() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parents">Student Reviews</TabsTrigger>
          <TabsTrigger value="alumni">Alumni Reviews</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parents">
          <div className="grid gap-4">
            {REVIEWS.parents.map((videoId, index) => (
              <Card key={index} className="p-4">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alumni">
          <div className="grid gap-4">
            {REVIEWS.alumni.map((videoId, index) => (
              <Card key={index} className="p-4">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faculty">
          <div className="grid gap-4">
            {REVIEWS.faculty.map((videoId, index) => (
              <Card key={index} className="p-4">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}