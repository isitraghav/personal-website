"use client";
import "./globals.css";
import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// Register once at module level
gsap.registerPlugin(ScrollTrigger);

export default function RootLayout({ children }) {
  useEffect(() => {
    // Lenis for buttery smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Bridge Lenis → ScrollTrigger so pinning/scrub works correctly
    lenis.on("scroll", ScrollTrigger.update);

    // Use Lenis RAF instead of default scroll events
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing for 1:1 scroll feel
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
