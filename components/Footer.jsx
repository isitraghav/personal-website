"use client";

export default function Footer() {
    return (
        <footer
            className="relative z-[5] w-full bg-black"
            style={{ height: "clamp(280px, 40vh, 400px)" }}
        >
            <div className="relative overflow-hidden w-full h-full flex justify-end text-right items-start py-10 sm:py-12 px-8 sm:px-12">
                {/* Navigation columns */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 md:gap-24 text-sm sm:text-base md:text-lg font-sans z-10 w-full justify-end">
                    {/* <ul className="space-y-2 text-white/70">
                        <li className="text-white font-bold uppercase text-xs tracking-widest mb-3">
                            Navigate
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition-colors duration-200">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition-colors duration-200">
                                About
                            </a>
                        </li>
                    </ul> */}
                    <ul className="space-y-2 text-white/70">
                        <li className="text-white font-bold uppercase text-xs tracking-widest mb-3">
                            Socials
                        </li>
                        <li>
                            <a
                                href="https://github.com/isitraghav"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors duration-200"
                            >
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://instagram.com/isitraghav"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors duration-200"
                            >
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://x.com/isitraghav"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors duration-200"
                            >
                                X
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Big branded text */}
                <h2
                    className="absolute bottom-0 left-0 translate-y-1/4 pointer-events-none select-none"
                    style={{
                        fontFamily: "var(--font-akira), sans-serif",
                        fontSize: "clamp(48px, 15vw, 200px)",
                        lineHeight: 1,
                        color: "rgba(255, 255, 255, 0.06)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}
                >
                    RAGHAV
                </h2>
            </div>
        </footer>
    );
}
