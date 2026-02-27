import Glaze from "../components/Glaze";
import MusicPlayer from "../components/MusicPlayer";
import MobileMusicPlayer from "../components/MobileMusicPlayer";
import HeroSection from "../components/HeroSection";
import TextTransition from "../components/TextTransition";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero — static, solid black bg, no Glaze */}
      <HeroSection />

      {/* Scroll transition text */}
      <TextTransition />

      {/* Glaze + MusicPlayer wrapper — Glaze sticks while MusicPlayer scrolls */}
      <div className="relative">
        {/* Glaze bg — sticky, stays pinned during MusicPlayer animations */}
        <div
          className="sticky top-0 z-0"
          style={{
            height: "100vh",
            pointerEvents: "none",
          }}
        >
          {/* Desktop Glaze with padding */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: "clamp(16px, 4vw, 40px)",
              left: "clamp(16px, 4vw, 40px)",
              right: "clamp(16px, 4vw, 40px)",
              bottom: "clamp(16px, 4vw, 40px)",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <Glaze />
          </div>

          {/* Mobile Full-width Glaze */}
          <div
            className="block md:hidden"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Glaze />
          </div>
        </div>

        {/* MusicPlayer overlaps the Glaze, sits above it */}
        <div
          className="relative z-10"
          style={{ marginTop: "-100vh" }}
        >
          {/* Desktop Music Player */}
          <div className="hidden md:block">
            <MusicPlayer />
          </div>
          {/* Mobile Music Player */}
          <div className="block md:hidden">
            <MobileMusicPlayer />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
