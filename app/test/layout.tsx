import { NavBar } from "@/components/navbar";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center ">
      <NavBar />
      {children}
    </div>
  );
}