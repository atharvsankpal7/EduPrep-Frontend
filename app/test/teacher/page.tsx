"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherDashboardPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Test Console</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Teacher-side test settings are currently being migrated to the new
            test engine architecture.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
