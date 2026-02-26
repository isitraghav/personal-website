import Glaze from "../components/Glaze";
import MusicPlayer from "../components/MusicPlayer";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero — static, solid black bg, no Glaze */}
      <HeroSection />

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
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              borderRadius: "24px",
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
          <MusicPlayer />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
