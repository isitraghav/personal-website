"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Airplay,
    Volume2,
    Heart,
    Briefcase,
    FolderGit2,
    Sparkles,
    Music2,
} from "lucide-react";
import sectionData from "../data/sections.json";

gsap.registerPlugin(ScrollTrigger);

const sections = sectionData.sections;
const SECTION_ICONS = [Briefcase, FolderGit2, Sparkles];

/* Total items across all sections, used for scroll math */
const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ── Playlist Item ─────────────────────────────────────────── */
function PlaylistItem({ item, index, isActive, isPlayed }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                transition: "all 0.35s ease",
                opacity: isActive ? 1 : isPlayed ? 0.6 : 0.35,
            }}
        >
            {/* Track number or playing indicator */}
            <div style={{
                width: "24px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: 500,
                color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                transition: "color 0.35s ease",
            }}>
                {isActive ? (
                    <Music2 size={14} color="#fff" />
                ) : (
                    index + 1
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "all 0.35s ease",
                }}>
                    {item.role}
                </p>
                <p style={{
                    margin: "1px 0 0",
                    fontSize: "12px",
                    color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "color 0.35s ease",
                }}>
                    {item.company}
                </p>
            </div>

            {/* Duration-like text */}
            <span style={{
                fontSize: "12px",
                color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                transition: "color 0.35s ease",
            }}>
                {item.period}
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════ */
export default function MobileMusicPlayer() {
    const [trackIdx, setTrackIdx] = useState(0);
    const [activeItemIdx, setActiveItemIdx] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.6);
    const [liked, setLiked] = useState(false);
    const [airplay, setAirplay] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [panelVisible, setPanelVisible] = useState(false);

    const section = sections[trackIdx];
    const SectionIcon = SECTION_ICONS[trackIdx];
    const progressPct = (progress / section.duration) * 100;
    const remaining = section.duration - progress;
    const intervalRef = useRef(null);

    /* GSAP refs */
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const artRef = useRef(null);
    const airplayRef = useRef(null);
    const progressRef = useRef(null);
    const volumeRef = useRef(null);
    const likeRef = useRef(null);
    const panelRef = useRef(null);
    const containerRef = useRef(null);
    const controlsContainerRef = useRef(null);

    /* ── Playback tick ────────────────────────────────────── */
    // Removed setInterval: progress is now driven by scroll position
    useEffect(() => {
        // We keep isPlaying state for UI toggle, but progress is externalized to scroll
    }, [isPlaying]);

    /* ── GSAP ScrollTrigger ───────────────────────────────── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const hiddenEls = [progressRef.current, likeRef.current];
            gsap.set(hiddenEls, { autoAlpha: 0, display: "none" });
            gsap.set(panelRef.current, { autoAlpha: 0, y: 100 });
            gsap.set(containerRef.current, { y: 150 });

            // State 0: 1:1 type vertical design
            gsap.set(cardRef.current, {
                width: 260,
                height: 380,
                borderRadius: 36,
            });
            gsap.set(artRef.current, {
                top: 20, left: 20,
                width: 220, height: 220,
                borderRadius: 14
            });
            gsap.set(controlsContainerRef.current, {
                top: 260, left: 20, right: 20
            });
            gsap.set(airplayRef.current, { autoAlpha: 1, scale: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 0.8,
                    start: "top top",
                    end: "+=6000",
                    onUpdate: (self) => {
                        const p = self.progress;

                        // Phase 2: Morph (0.08 → 0.16)
                        setIsExpanded(p > 0.12);

                        // Phase 3: panel slides in (0.16 → 0.20)
                        setPanelVisible(p > 0.18);

                        // Phase 4: iterate through sections + items (0.20 → 1.0)
                        if (p <= 0.20) {
                            setTrackIdx(0);
                            setActiveItemIdx(-1);
                            setProgress(0);
                        } else {
                            // Remaining scroll: 0.20 → 1.0 = 0.80
                            const contentP = (p - 0.20) / 0.80; // normalized 0→1 across all items

                            // Exact progression across all items (e.g., 2.5 means middle of 3rd item)
                            const globalProgress = contentP * totalItems;
                            const clampedGlobal = Math.max(0, Math.min(globalProgress, totalItems - 0.001));

                            // Find which section and item this maps to
                            let cumulative = 0;
                            for (let i = 0; i < sections.length; i++) {
                                const itemsInThisSection = sections[i].items.length;
                                if (clampedGlobal < cumulative + itemsInThisSection) {
                                    // Found the section
                                    const indexInSec = clampedGlobal - cumulative;
                                    const activeIdx = Math.floor(indexInSec);

                                    setTrackIdx(i);
                                    setActiveItemIdx(activeIdx);

                                    // Smooth progress: interpolate within each item's range
                                    const fractional = indexInSec - activeIdx; // 0→1 within current item
                                    const itemStart = activeIdx / itemsInThisSection;
                                    const itemEnd = (activeIdx + 1) / itemsInThisSection;
                                    const smoothProgress = itemStart + fractional * (itemEnd - itemStart);
                                    setProgress(smoothProgress * sections[i].duration);
                                    break;
                                }
                                cumulative += itemsInThisSection;
                            }
                        }
                    },
                },
            });

            // ── Phase 1: Shift Container Upwards (0 → 0.08) ────────────────────
            // Move the centered 1:1 card to the top
            tl.to(containerRef.current, {
                y: 0,
                duration: 0.08, ease: "power2.inOut",
            }, 0);

            // ── Phase 2: Morph from vertical to horizontal sideways layout (0.08 → 0.16) ──────────
            tl.to(cardRef.current, {
                width: "90vw",
                height: 124,
                borderRadius: 24,
                duration: 0.08, ease: "power2.inOut",
            }, 0.08);

            tl.to(artRef.current, {
                top: 22, left: 16,
                width: 80, height: 80,
                borderRadius: 12,
                duration: 0.08, ease: "power2.inOut",
            }, 0.08);

            tl.to(controlsContainerRef.current, {
                top: 14, left: 112, right: 16,
                duration: 0.08, ease: "power2.inOut",
            }, 0.08);

            tl.to(airplayRef.current, {
                autoAlpha: 0, scale: 0.4,
                duration: 0.04, ease: "power2.in",
            }, 0.08);

            tl.to(likeRef.current, {
                display: "flex", autoAlpha: 1,
                duration: 0.04, ease: "power2.out",
            }, 0.12);

            tl.to(progressRef.current, {
                display: "block", autoAlpha: 1,
                duration: 0.04, ease: "power2.out",
            }, 0.12);

            // ── Phase 3: Panel slides up from below + Slight shift up (0.16 → 0.20)
            tl.to(containerRef.current, {
                y: -10, // Slight upward shift to make room for playlist
                duration: 0.04, ease: "power3.out",
            }, 0.16);

            tl.to(panelRef.current, {
                autoAlpha: 1, y: 0,
                duration: 0.04, ease: "power3.out",
            }, 0.16);

            // Dummy tween to extend timeline to full duration
            tl.to({}, { duration: 0.01 }, 1);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handlePrev = () => {
        setProgress(0);
        setTrackIdx((i) => (i - 1 + sections.length) % sections.length);
        setActiveItemIdx(0);
    };
    const handleNext = () => {
        setProgress(0);
        setTrackIdx((i) => (i + 1) % sections.length);
        setActiveItemIdx(0);
    };

    const iconBtn = (active) => ({
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "#fff" : "rgba(255,255,255,0.38)",
        transition: "color 0.2s, transform 0.15s",
    });
    const press = (e) => (e.currentTarget.style.transform = "scale(0.85)");
    const release = (e) => (e.currentTarget.style.transform = "scale(1)");

    /* ═══════════════════════════════════════════════════════ */
    return (
        <section
            ref={sectionRef}
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center", // Vertically center the container
                justifyContent: "center",
            }}
        >
            {/* Main layout: wrapper for vertical stacking on mobile */}
            <div
                ref={containerRef}
                style={{
                    position: "relative",
                    transform: "translateY(150px)", // Initially centered vertically
                    display: "flex",
                    flexDirection: "column",   // Stack player and playlist vertically
                    alignItems: "center",
                    gap: "8px",               // Less distance between player and playlist card
                    willChange: "transform",
                    width: "100%",
                }}
            >
                {/* ── Mobile Music Player Card ──────────────────────── */}
                <div
                    ref={cardRef}
                    style={{
                        background: "#0a0a0a",
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
                        userSelect: "none",
                        flexShrink: 0,
                        zIndex: 2,
                        willChange: "width, height, border-radius",
                    }}
                >
                    {/* AirPlay */}
                    <button
                        ref={airplayRef}
                        onClick={() => setAirplay((a) => !a)}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: airplay ? "rgba(220,50,50,0.18)" : "rgba(255,255,255,0.08)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 5,
                            transition: "background 0.2s",
                            willChange: "opacity, transform",
                        }}
                    >
                        <Airplay size={18} color={airplay ? "#e53935" : "rgba(255,255,255,0.6)"} />
                    </button>

                    {/* Album art */}
                    <div
                        ref={artRef}
                        style={{
                            display: "block",
                            position: "absolute",
                            overflow: "hidden",
                            background: "#111",
                            willChange: "top, left, width, height, border-radius",
                        }}
                    >
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${section.albumArt})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transition: "background-image 0.4s ease",
                        }} />
                    </div>

                    {/* Info + controls */}
                    <div
                        ref={controlsContainerRef}
                        style={{
                            position: "absolute",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            willChange: "top, left, right",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{
                                    margin: 0, fontSize: "16px", fontWeight: 700,
                                    color: "#fff", letterSpacing: "0.02em", lineHeight: 1.2,
                                    display: "flex", alignItems: "center", gap: "6px",
                                    transition: "all 0.3s ease",
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                }}>
                                    <SectionIcon size={14} color="rgba(255,255,255,0.5)" />
                                    {section.title}
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {section.artist}
                                </p>
                            </div>

                            <button ref={likeRef} onClick={() => setLiked((l) => !l)} style={{
                                ...iconBtn(liked),
                                color: liked ? "#e74c3c" : "rgba(255,255,255,0.35)",
                                flexShrink: 0, marginTop: "2px",
                            }}>
                                <Heart size={20} fill={liked ? "#e74c3c" : "none"} />
                            </button>
                        </div>

                        {/* Progress */}
                        <div ref={progressRef}>
                            <div style={{ position: "relative", height: "3px", cursor: "pointer" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
                                <div style={{ position: "absolute", top: 0, left: 0, width: `${progressPct}%`, height: "100%", borderRadius: "2px", background: "#fff", transition: "width 0.5s linear" }} />
                                <input type="range" min={0} max={100} value={progressPct}
                                    onChange={(e) => setProgress((parseFloat(e.target.value) / 100) * section.duration)}
                                    style={{ position: "absolute", inset: "-8px 0", opacity: 0, cursor: "pointer", width: "100%" }}
                                />
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                            <button style={iconBtn(true)} onClick={handlePrev} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
                                <SkipBack size={26} fill="white" color="white" />
                            </button>
                            <button onClick={() => setIsPlaying((p) => !p)} onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={{ ...iconBtn(true), color: "white" }}>
                                {isPlaying ? <Pause size={34} fill="white" color="white" /> : <Play size={34} fill="white" color="white" />}
                            </button>
                            <button style={iconBtn(true)} onClick={handleNext} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
                                <SkipForward size={26} fill="white" color="white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Playlist Panel (scroll-triggered) ─────── */}
                {/* Note: changed position from absolute right to relative bottom for mobile */}
                <div
                    ref={panelRef}
                    style={{
                        position: "relative",
                        width: "90vw",
                        maxWidth: "400px",
                        background: "#0a0a0a",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
                        zIndex: 1,
                        willChange: "opacity, transform",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "16px",
                    }}
                >
                    {/* Playlist header — album style */}
                    <div style={{
                        padding: "20px 20px 14px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        {/* Mini album art */}
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            flexShrink: 0,
                            backgroundImage: `url(${section.albumArt})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transition: "background-image 0.4s ease",
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                margin: 0, fontSize: "15px", fontWeight: 700,
                                color: "#fff", letterSpacing: "0.02em",
                                transition: "all 0.3s ease",
                            }}>
                                {section.title}
                            </p>
                            <p style={{
                                margin: "2px 0 0", fontSize: "12px",
                                color: "rgba(255,255,255,0.35)", fontWeight: 400,
                            }}>
                                {section.items.length} tracks · {section.artist}
                            </p>
                        </div>
                        <SectionIcon size={18} color="rgba(255,255,255,0.3)" />
                    </div>

                    {/* Playlist items */}
                    <div style={{
                        flex: 1,
                        padding: "8px 6px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                    }}>
                        {section.items.map((item, i) => (
                            <PlaylistItem
                                key={`${trackIdx}-${i}`}
                                item={item}
                                index={i}
                                isActive={i === activeItemIdx}
                                isPlayed={i < activeItemIdx}
                            />
                        ))}
                    </div>

                    {/* Description — lyrics style */}
                    {activeItemIdx >= 0 && section.items[activeItemIdx] && (
                        <div style={{
                            padding: "14px 20px 20px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.55)",
                                lineHeight: 1.6,
                                fontStyle: "italic",
                                letterSpacing: "0.01em",
                                transition: "all 0.4s ease",
                            }}>
                                {section.items[activeItemIdx].description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
