"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextTransition() {
    const sectionRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 640;

        const ctx = gsap.context(() => {
            gsap.set(textRef.current, { opacity: 0, y: 40 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 0.6,
                    start: "top top",
                    end: isMobile ? "+=800" : "+=1200",
                },
            });

            // Fade in text
            tl.to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
            }, 0);

            // Hold for reading
            tl.to({}, { duration: 0.4 }, 0.4);

            // Fade out
            tl.to(textRef.current, {
                opacity: 0,
                y: -30,
                duration: 0.2,
                ease: "power2.in",
            }, 0.8);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const textStyle = {
        fontFamily: "var(--font-playfair), serif",
        fontWeight: "normal",
        textTransform: "none",
        lineHeight: 1.3,
        color: "#fff",
        textAlign: "center",
    };

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
                background: "#000",
                overflow: "hidden",
            }}
        >
            <div
                ref={textRef}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    padding: "0 clamp(16px, 5vw, 24px)",
                    maxWidth: "800px",
                }}
            >
                <p style={{ ...textStyle, margin: 0, fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}>
                    i have been engineering software for a while now
                </p>
                <p
                    style={{
                        ...textStyle,
                        margin: 0,
                        fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
                        opacity: 0.5,
                    }}
                >
                    find my work below ↓
                </p>
            </div>
        </section>
    );
}
