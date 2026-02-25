"use client";
import { useRef, useEffect, useState, useCallback } from "react";
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
    ChevronRight,
} from "lucide-react";
import sectionData from "../data/sections.json";

gsap.registerPlugin(ScrollTrigger);

const sections = sectionData.sections;
const SECTION_ICONS = [Briefcase, FolderGit2, Sparkles];

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ── Content Panel Item ────────────────────────────────────── */
function SectionItem({ item, index }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            <div
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    fontWeight: 600,
                }}
            >
                {index + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
                    {item.role}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
                    {item.company} · {item.period}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 400, lineHeight: 1.4 }}>
                    {item.description}
                </p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: "8px" }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════ */
export default function MusicPlayer() {
    const [trackIdx, setTrackIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(109);
    const [volume, setVolume] = useState(0.6);
    const [liked, setLiked] = useState(false);
    const [airplay, setAirplay] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrollCycle, setScrollCycle] = useState(0); // tracks how many full loops

    const section = sections[trackIdx];
    const SectionIcon = SECTION_ICONS[trackIdx];
    const progressPct = (progress / section.duration) * 100;
    const remaining = section.duration - progress;
    const intervalRef = useRef(null);
    const hoverTlRef = useRef(null);
    const lastIdxRef = useRef(0);

    /* GSAP refs */
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const artRef = useRef(null);
    const airplayRef = useRef(null);
    const progressRef = useRef(null);
    const volumeRef = useRef(null);
    const likeRef = useRef(null);
    const containerRef = useRef(null);
    const panelRef = useRef(null);

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

    /* ── GSAP ScrollTrigger MORPH + INFINITE LOOP ─────────── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const hiddenEls = [progressRef.current, volumeRef.current, likeRef.current];
            gsap.set(hiddenEls, { autoAlpha: 0, display: "none" });
            gsap.set(panelRef.current, { autoAlpha: 0, x: 40, scale: 0.95 });
            gsap.set(cardRef.current, { width: 260, borderRadius: 36, padding: "20px" });
            gsap.set(artRef.current, { width: 120, height: 120, borderRadius: 14 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 0.8,
                    start: "top top",
                    end: "+=4000",
                    onUpdate: (self) => {
                        const p = self.progress;
                        setIsExpanded(p > 0.18);

                        // Morph phase: 0–0.18- (first ~720px)
                        // After morph, cycle through sections infinitely
                        if (p <= 0.18) {
                            setTrackIdx(0);
                        } else {
                            // Remaining 0.82 of range, split into repeating chunks
                            const afterMorph = (p - 0.18) / 0.82; // 0→1 normalized
                            // Multiply by section count to get repeating cycles
                            const totalSections = sections.length;
                            const cycleProgress = afterMorph * totalSections * 2; // 2 full loops
                            const idx = Math.floor(cycleProgress) % totalSections;
                            setTrackIdx(idx);
                        }
                    },
                },
            });

            // Morph animations — compressed to first 0.18
            tl.to(cardRef.current, {
                width: 340, borderRadius: 28, padding: "20px",
                duration: 0.18, ease: "power2.inOut",
            }, 0);

            tl.to(artRef.current, {
                width: 300, height: 300, borderRadius: 20,
                duration: 0.18, ease: "power2.inOut",
            }, 0);

            tl.to(airplayRef.current, {
                autoAlpha: 0, scale: 0.4,
                duration: 0.08, ease: "power2.in",
            }, 0);

            tl.to(likeRef.current, {
                display: "flex", autoAlpha: 1,
                duration: 0.06, ease: "power2.out",
            }, 0.1);

            tl.to(progressRef.current, {
                display: "block", autoAlpha: 1,
                duration: 0.06, ease: "power2.out",
            }, 0.12);

            tl.to(volumeRef.current, {
                display: "flex", autoAlpha: 1,
                duration: 0.06, ease: "power2.out",
            }, 0.15);

            // Add a dummy tween at position 1 so the timeline extends to the full scroll range
            tl.to({}, { duration: 0.01 }, 1);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    /* ── Hover animation: shift player left + reveal panel ── */
    useEffect(() => {
        if (!containerRef.current || !panelRef.current || !cardRef.current) return;

        if (!hoverTlRef.current) {
            hoverTlRef.current = gsap.timeline({ paused: true });
            hoverTlRef.current
                .to(cardRef.current, {
                    x: -200, duration: 0.5, ease: "power3.out",
                }, 0)
                .to(panelRef.current, {
                    autoAlpha: 1, x: 0, scale: 1,
                    duration: 0.5, ease: "power3.out",
                }, 0.08);
        }

        if (isHovered && isExpanded) {
            hoverTlRef.current.play();
        } else {
            hoverTlRef.current.reverse();
        }
    }, [isHovered, isExpanded]);

    const handlePrev = () => {
        setProgress(0);
        setTrackIdx((i) => (i - 1 + sections.length) % sections.length);
    };
    const handleNext = () => {
        setProgress(0);
        setTrackIdx((i) => (i + 1) % sections.length);
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
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    position: "relative",
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
                        willChange: "width, border-radius, padding, transform",
                        zIndex: 2,
                    }}
                >
                    {/* Album art — per-section image */}
                    <div
                        ref={artRef}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            display: "block",
                            width: "120px",
                            height: "120px",
                            alignSelf: "flex-start",
                            borderRadius: "14px",
                            overflow: "hidden",
                            position: "relative",
                            background: "#111",
                            cursor: isExpanded ? "pointer" : "default",
                            willChange: "width, height, border-radius",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                backgroundImage: `url(${section.albumArt})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                transition: "background-image 0.4s ease",
                            }}
                        />
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
                                <p style={{
                                    margin: "3px 0 0", fontSize: "14px",
                                    color: "rgba(255,255,255,0.5)", fontWeight: 400,
                                }}>
                                    {section.artist}
                                </p>
                            </div>

                            <button
                                ref={likeRef}
                                onClick={() => setLiked((l) => !l)}
                                style={{
                                    ...iconBtn(liked),
                                    color: liked ? "#e74c3c" : "rgba(255,255,255,0.35)",
                                    flexShrink: 0, marginTop: "2px",
                                }}
                            >
                                <Heart size={22} fill={liked ? "#e74c3c" : "none"} />
                            </button>
                        </div>

                        {/* Progress bar */}
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

                        {/* Playback controls */}
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

                {/* ── Content Panel ──────────────────────────── */}
                <div
                    ref={panelRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        position: "absolute",
                        left: "calc(100% - 180px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "380px",
                        background: "#0a0a0a",
                        borderRadius: "28px",
                        padding: "28px 24px",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
                        zIndex: 1,
                        willChange: "opacity, transform",
                        pointerEvents: isHovered && isExpanded ? "all" : "none",
                    }}
                >
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        marginBottom: "8px", paddingBottom: "12px",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: "rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <SectionIcon size={18} color="rgba(255,255,255,0.6)" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>
                                {section.title}
                            </p>
                            <p style={{ margin: "1px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                                {section.items.length} items
                            </p>
                        </div>
                    </div>

                    <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                        {section.items.map((item, i) => (
                            <SectionItem key={`${trackIdx}-${i}`} item={item} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
