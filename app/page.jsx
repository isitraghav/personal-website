import Glaze from "../components/Glaze";
import MusicPlayer from "../components/MusicPlayer";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        background: "#000",
        minHeight: "600vh",
        overflow: "hidden",
      }}
    >
      {/* Glaze bg — fixed, never moves */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          zIndex: 0,
          borderRadius: "24px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Glaze />
      </div>

      {/* Music player + content panel */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <MusicPlayer />
      </div>
    </main>
  );
}
