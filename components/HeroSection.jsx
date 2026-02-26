"use client";
import MediaBetweenText from "./MediaBetweenText";

export default function HeroSection() {
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
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <MediaBetweenText
                    firstText="Hi  ("
                    secondText=") I'm Raghav"
                    mediaUrl="/raghav.jpeg"
                    mediaType="image"
                    alt="Raghav"
                    triggerType="hover"
                    mediaContainerClassName="rounded-lg overflow-hidden"
                    className="flex flex-row items-center justify-center cursor-pointer"
                    leftTextClassName="text-white pointer-events-none select-none"
                    rightTextClassName="text-white pointer-events-none select-none"
                    animationVariants={{
                        initial: { width: 0, opacity: 0 },
                        animate: {
                            width: "100px",
                            opacity: 1,
                            transition: { duration: 0.4, type: "spring", bounce: 0 },
                        },
                    }}
                    style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "clamp(2rem, 5vw, 5rem)",
                        fontWeight: "normal",
                        textTransform: "none",
                        lineHeight: 1,
                    }}
                />
            </div>
        </section>
    );
}
