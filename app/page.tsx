"use client";

import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import gsap from "gsap";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const items = [
    { name: "Jessica Walsh", num: "35" },
    { name: "Salwan Georges", num: "29" },
    { name: "Sascha Lobe", num: "05" },
    { name: "Time", num: "40" },
    { name: "Alexandra Morawiak", num: "27" },
  ];

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial states for animation
    gsap.set(textRef.current, { yPercent: 100, opacity: 0 });
    gsap.set(dotRef.current, { scale: 0, opacity: 0 });
    gsap.set(gridItemsRef.current, { y: 20, opacity: 0 });

    tl.to(textRef.current, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
    })
      .to(
        dotRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      )
      .to(
        gridItemsRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.6"
      );

    // Mouse follow logic using gsap.quickTo
    const xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.4, ease: "power3.out" });

    // Make sure dot is hidden if user moves pointer fast before entering?
    let isFirstMove = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (isFirstMove) {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
        isFirstMove = false;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans flex flex-col pt-0 bg-[#DCDBD5] text-[#212121] cursor-default" ref={containerRef}>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {/* Massive Text Section */}
        <div className="w-full px-3 md:px-6 pt-4 pb-0 flex justify-center overflow-hidden">
          <svg
            ref={textRef}
            className="w-full h-auto block"
            viewBox="0 0 1150 200"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="165"
              fill="#212121"
              fontFamily="var(--font-geist-sans), sans-serif"
              fontWeight="900"
              fontSize="220"
              textLength="1150"
              lengthAdjust="spacing"
            >
              RAGHAV<tspan fontWeight="200">(</tspan>Y<tspan fontWeight="200">)</tspan>
            </text>
          </svg>
        </div>

        {/* Dot section with top/bottom borders (Empty now, dot is free-floating) */}
        <div className="w-full border-y-[1.5px] border-[#212121] mt-8 py-6 flex items-center min-h-[64px]">
        </div>

        {/* Global Custom Cursor Dot */}
        <div
          ref={dotRef}
          className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none mix-blend-difference z-[9999]"
          style={{ transform: "translate(-50%, -50%)" }}
        ></div>

        {/* Grid Section */}
        <div className="w-full flex md:grid md:grid-cols-6 h-[16.6vh] min-h-[120px] md:h-auto md:min-h-[220px] border-b-[1.5px] border-[#212121] overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                gridItemsRef.current[index] = el;
              }}
              className="flex-shrink-0 w-[45%] md:w-auto flex flex-col justify-between p-3 md:p-4 border-r-[1.5px] border-[#212121] snap-start"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-medium tracking-tight pr-2">{item.name}</span>
                <span className="text-[8px] mt-1">●</span>
              </div>
              <div className="text-center pb-2 md:pb-6">
                <span className="text-[12px] font-medium tracking-wide">({item.num})</span>
              </div>
            </div>
          ))}

          {/* 6th Empty Column with Update Text */}
          <div
            ref={(el) => {
              gridItemsRef.current[5] = el;
            }}
            className="flex-shrink-0 w-[45%] md:w-auto flex flex-col justify-end items-end p-3 md:p-4 relative snap-start"
          >
            <span className="text-[11px] font-medium absolute bottom-3 md:bottom-4 right-4 md:right-6 tracking-tight">Update: 05 Aug.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
