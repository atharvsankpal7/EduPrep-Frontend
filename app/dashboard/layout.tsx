import type { Metadata } from "next";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
    title: "My Dashboard",
    description:
        "Review all your previously attempted tests, track your scores, and access detailed result analysis.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center">
            <NavBar />
            {children}
        </div>
    );
}
