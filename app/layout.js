"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Lenis from 'lenis'
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

export default function RootLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);


  }, [])

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
