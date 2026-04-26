"use client";
import MetroLine from "../components/metro-line";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SendPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(null);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
  if (!message.trim()) return;

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Something went wrong");
      return;
    }

    setMessage("");
    router.push("/");
  } catch (e) {
    setError("Could not connect to server");
  }
};

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lineColors = ["#71B432", "#0091D1", "#CCB502"];

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
        background: "#f0f0f0",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
        <MetroLine
          start={{ x: 0.0, y: 0.8 }}
          end={{ x: 1.0, y: 0.2 }}
          colors={lineColors}
          cornerRadius={48}
          midRatio={0.5}
          screenWidth={dimensions.width}
          screenHeight={dimensions.height}
        />
      </div>

      {/* Content wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER (back to top) */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            position: "relative",
            marginBottom: "2rem",
            marginTop: "3rem"
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              position: "absolute",
              left: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "#666",
              top: "-50px"
            }}
          >
            ✕
          </button>

          <h1
            style={{
              width: "100%",
              textAlign: "center",
              color: "#000",
              fontFamily: "Geologica, sans-serif",
              fontSize: "2rem",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Send Message
          </h1>
        </div>

        {/* CENTERED INPUT AREA */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem", // pushes input down a bit
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <label
              style={{
                color: "#000",
                fontFamily: "Geologica, sans-serif",
                fontSize: "1.125rem",
              }}
            >
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                background: "#fff",
                width: "100%",
                height: "14rem",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #000",
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: "Geologica, sans-serif",
                fontSize: "1rem",
                resize: "none",
              }}
            />

            {error && (
              <p style={{ color: "red", fontFamily: "Geologica, sans-serif", fontSize: "0.9rem", margin: 0 }}>
                {error}
              </p>
            )}

            {/* LEFT-ALIGNED BUTTON */}
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "1.5rem",
                alignSelf: "flex-start", // 👈 left aligned
                borderRadius: "0.375rem",
                background: "#050756",
                padding: "0.375rem 1.25rem",
                border: "none",
                cursor: "pointer",
                color: "#FFF",
                fontFamily: "Geologica, sans-serif",
                fontSize: "1.125rem",
              }}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}