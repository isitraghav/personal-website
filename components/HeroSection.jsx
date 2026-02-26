"use client";
import { useRef, useEffect } from "react";
import MediaBetweenText from "./MediaBetweenText";

export default function HeroSection() {
    const mediaRef = useRef(null);
    const isHovered = useRef(false);

    useEffect(() => {
        const threshold = window.innerHeight * 0.25;

        const handleScroll = () => {
            if (window.scrollY > threshold) {
                mediaRef.current?.animate();
            } else if (!isHovered.current) {
                mediaRef.current?.reset();
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseEnter = () => {
        isHovered.current = true;
        mediaRef.current?.animate();
    };

    const handleMouseLeave = () => {
        isHovered.current = false;
        // Only close if scroll hasn't revealed it
        if (window.scrollY <= window.innerHeight * 0.25) {
            mediaRef.current?.reset();
        }
    };

    const textStyle = {
        fontFamily: "var(--font-playfair), serif",
        fontSize: "clamp(2rem, 5vw, 5rem)",
        fontWeight: "normal",
        textTransform: "none",
        lineHeight: 1.2,
        color: "#fff",
        textAlign: "center",
    };

    return (
        <section
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                <MediaBetweenText
                    ref={mediaRef}
                    firstText="Hi"
                    secondText="I'm Raghav"
                    mediaUrl="/raghav2.jpeg"
                    mediaType="image"
                    alt="Raghav"
                    triggerType="ref"
                    mediaContainerClassName="rounded-lg overflow-hidden h-[100px] sm:h-[120px]"
                    className="flex flex-row items-center justify-center gap-2"
                    leftTextClassName="text-white select-none"
                    rightTextClassName="text-white select-none"
                    animationVariants={{
                        initial: { width: 0, opacity: 0 },
                        animate: {
                            width: "auto",
                            opacity: 1,
                            transition: { duration: 0.4, type: "spring", bounce: 0 },
                        },
                    }}
                    style={textStyle}
                />
            </div>
        </section>
    );
}
