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
                borderRadius: "12px",
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
export default function MusicPlayer() {
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

    /* ── Playback tick ────────────────────────────────────── */
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress((p) => {
                    if (p >= section.duration) {
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return 0;
                    }
                    return p + 0.5;
                });
            }, 500);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, section.duration]);

    /* ── GSAP ScrollTrigger ───────────────────────────────── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const hiddenEls = [progressRef.current, volumeRef.current, likeRef.current];
            gsap.set(hiddenEls, { autoAlpha: 0, display: "none" });
            gsap.set(panelRef.current, { autoAlpha: 0, x: 60 });
            gsap.set(containerRef.current, { x: 0 });
            gsap.set(cardRef.current, { width: 260, borderRadius: 36, padding: "20px" });
            gsap.set(artRef.current, { width: 120, height: 120, borderRadius: 14 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 0.8,
                    start: "top top",
                    end: "+=6000",
                    onUpdate: (self) => {
                        const p = self.progress;

                        // Phase 1: morph (0 → 0.12)
                        setIsExpanded(p > 0.12);

                        // Phase 2: panel slides in (0.12 → 0.16)
                        setPanelVisible(p > 0.14);

                        // Phase 3: iterate through sections + items (0.16 → 1.0)
                        if (p <= 0.16) {
                            setTrackIdx(0);
                            setActiveItemIdx(-1);
                        } else {
                            // Remaining scroll: 0.16 → 1.0 = 0.84
                            const contentP = (p - 0.16) / 0.84; // normalized 0→1

                            // Calculate cumulative item index
                            const globalIdx = Math.floor(contentP * totalItems);
                            const clampedIdx = Math.min(globalIdx, totalItems - 1);

                            // Find which section and item this maps to
                            let cumulative = 0;
                            let secIdx = 0;
                            let itemIdx = 0;
                            for (let i = 0; i < sections.length; i++) {
                                if (clampedIdx < cumulative + sections[i].items.length) {
                                    secIdx = i;
                                    itemIdx = clampedIdx - cumulative;
                                    break;
                                }
                                cumulative += sections[i].items.length;
                            }

                            setTrackIdx(secIdx);
                            setActiveItemIdx(itemIdx);
                        }
                    },
                },
            });

            // ── Phase 1: Morph (0 → 0.12) ────────────────────
            tl.to(cardRef.current, {
                width: 340, borderRadius: 28, padding: "20px",
                duration: 0.12, ease: "power2.inOut",
            }, 0);

            tl.to(artRef.current, {
                width: 300, height: 300, borderRadius: 20,
                duration: 0.12, ease: "power2.inOut",
            }, 0);

            tl.to(airplayRef.current, {
                autoAlpha: 0, scale: 0.4,
                duration: 0.06, ease: "power2.in",
            }, 0);

            tl.to(likeRef.current, {
                display: "flex", autoAlpha: 1,
                duration: 0.04, ease: "power2.out",
            }, 0.06);

            tl.to(progressRef.current, {
                display: "block", autoAlpha: 1,
                duration: 0.04, ease: "power2.out",
            }, 0.08);

            tl.to(volumeRef.current, {
                display: "flex", autoAlpha: 1,
                duration: 0.04, ease: "power2.out",
            }, 0.1);

            // ── Phase 2: Container shifts left + Panel slides in (0.12 → 0.16)
            tl.to(containerRef.current, {
                x: -100,
                duration: 0.04, ease: "power3.out",
            }, 0.12);

            tl.to(panelRef.current, {
                autoAlpha: 1, x: 0,
                duration: 0.04, ease: "power3.out",
            }, 0.12);

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
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Main layout: player center → shifts left on scroll */}
            <div
                ref={containerRef}
                style={{
                    position: "relative",
                    transform: "translateX(0)",
                    willChange: "transform",
                }}
            >
                {/* ── Music Player Card ──────────────────────── */}
                <div
                    ref={cardRef}
                    style={{
                        width: "260px",
                        borderRadius: "36px",
                        background: "#0a0a0a",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
                        userSelect: "none",
                        willChange: "width, border-radius, padding",
                        flexShrink: 0,
                        zIndex: 2,
                    }}
                >
                    {/* Album art — per-section */}
                    <div
                        ref={artRef}
                        style={{
                            display: "block",
                            width: "120px",
                            height: "120px",
                            alignSelf: "flex-start",
                            borderRadius: "14px",
                            overflow: "hidden",
                            position: "relative",
                            background: "#111",
                            willChange: "width, height, border-radius",
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

                    {/* Info + controls */}
                    <div style={{ padding: "14px 16px 6px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{
                                    margin: 0, fontSize: "18px", fontWeight: 700,
                                    color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2,
                                    display: "flex", alignItems: "center", gap: "8px",
                                    transition: "all 0.3s ease",
                                }}>
                                    <SectionIcon size={16} color="rgba(255,255,255,0.5)" />
                                    {section.title}
                                </p>
                                <p style={{ margin: "3px 0 0", fontSize: "14px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                                    {section.artist}
                                </p>
                            </div>

                            <button ref={likeRef} onClick={() => setLiked((l) => !l)} style={{
                                ...iconBtn(liked),
                                color: liked ? "#e74c3c" : "rgba(255,255,255,0.35)",
                                flexShrink: 0, marginTop: "2px",
                            }}>
                                <Heart size={22} fill={liked ? "#e74c3c" : "none"} />
                            </button>
                        </div>

                        {/* Progress */}
                        <div ref={progressRef}>
                            <div style={{ position: "relative", height: "3px", cursor: "pointer" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
                                <div style={{ position: "absolute", top: 0, left: 0, width: `${progressPct}%`, height: "100%", borderRadius: "2px", background: "#fff", transition: "width 0.5s linear" }} />
                                <div style={{
                                    position: "absolute", top: "50%", left: `${progressPct}%`,
                                    transform: "translate(-50%, -50%)",
                                    width: "11px", height: "11px", borderRadius: "50%",
                                    background: "#fff", boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                                    transition: "left 0.5s linear",
                                }} />
                                <input type="range" min={0} max={100} value={progressPct}
                                    onChange={(e) => setProgress((parseFloat(e.target.value) / 100) * section.duration)}
                                    style={{ position: "absolute", inset: "-8px 0", opacity: 0, cursor: "pointer", width: "100%" }}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
                                <span>{formatTime(progress)}</span>
                                <span>-{formatTime(remaining)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "2px" }}>
                            <button style={iconBtn(true)} onClick={handlePrev} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
                                <SkipBack size={36} fill="white" color="white" />
                            </button>
                            <button onClick={() => setIsPlaying((p) => !p)} onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={{ ...iconBtn(true), color: "white" }}>
                                {isPlaying ? <Pause size={44} fill="white" color="white" /> : <Play size={44} fill="white" color="white" />}
                            </button>
                            <button style={iconBtn(true)} onClick={handleNext} onMouseDown={press} onMouseUp={release} onMouseLeave={release}>
                                <SkipForward size={36} fill="white" color="white" />
                            </button>
                        </div>

                        {/* Volume */}
                        <div ref={volumeRef} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px", padding: "0 32px" }}>
                            <Volume2 size={16} color="rgba(255,255,255,0.35)" />
                            <div style={{ flex: 1, position: "relative", height: "3px" }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
                                <div style={{ position: "absolute", top: 0, left: 0, width: `${volume * 100}%`, height: "100%", borderRadius: "2px", background: "rgba(255,255,255,0.6)" }} />
                                <input type="range" min={0} max={1} step={0.01} value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    style={{ position: "absolute", inset: "-8px 0", opacity: 0, cursor: "pointer", width: "100%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Playlist Panel (scroll-triggered) ─────── */}
                <div
                    ref={panelRef}
                    style={{
                        position: "absolute",
                        left: "calc(100% + 24px)",
                        top: 0,
                        width: "340px",
                        background: "#0a0a0a",
                        borderRadius: "28px",
                        overflow: "hidden",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
                        zIndex: 1,
                        willChange: "opacity, transform",
                        display: "flex",
                        flexDirection: "column",
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
                </div>
            </div>
        </section>
    );
}
