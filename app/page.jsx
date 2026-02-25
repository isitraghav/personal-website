import Glaze from "../components/Glaze";
import MusicPlayer from "../components/MusicPlayer";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        background: "transparent",
        minHeight: "1000vh",
        overflow: "hidden",
      }}
    >
      {/* Glaze bg — fixed, at the bottom of the stack */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          borderRadius: "24px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1, // Ensure it's behind everything
        }}
      >
        <Glaze />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Music player + portfolio navigation */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <MusicPlayer />
      </div>
    </main>
  );
}
