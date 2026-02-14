import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import LandingPageClient from "./landingPage-antigravity/LandingPageClient";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export default function Home() {
  return <LandingPageClient fontVars={`${outfit.variable} ${jakarta.variable}`} />;
}