"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const sectionRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(textRef.current, { scale: 1, opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 0.6,
                    start: "top top",
                    end: "+=1200",
                },
            });

            tl.to(textRef.current, {
                scale: 45, // Slightly deeper zoom
                opacity: 0,
                duration: 1.5,
                ease: "expo.inOut",
            }, 0);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                height: "100vh",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                overflow: "hidden",
                // Removing isolation factors
                isolation: "auto",
            }}
        >
            <div
                ref={textRef}
                style={{
                    willChange: "transform, opacity",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        // Reference the CSS variable from layout.js
                        fontFamily: "var(--font-akira), sans-serif",
                        fontSize: "clamp(80px, 15vw, 220px)",
                        fontWeight: "normal",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        color: "#fff",
                        // Exclusion or difference for inversion effect
                        mixBlendMode: "exclusion",
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                >
                    RAGHAV
                </h1>
            </div>
        </section>
    );
}
