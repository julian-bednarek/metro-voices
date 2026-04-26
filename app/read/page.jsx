"use client";
import MetroLine from "../components/metro-line";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReadPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
      if (data?.error) {
        setError(data.error);
    } else {
      setMessage(data);
    }
  })
  .catch(() => setError("Could not connect to server"))
  .finally(() => setLoading(false));

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
        background: "#f5f5f5",
        overflow: "hidden",
        padding: "1.5rem",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
        <MetroLine
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 1.0, y: 0.9 }}
          colors={lineColors}
          cornerRadius={48}
          midRatio={0.7}
          screenWidth={dimensions.width}
          screenHeight={dimensions.height}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              position: "absolute",
              left: 0,
              top: "-2px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "#000",
            }}
          >
            ✕
          </button>

          <h1
            style={{
              fontFamily: "Geologica, sans-serif",
              fontSize: "1.8rem",
              fontWeight: 400,
              margin: 0,
              color: "#000",
            }}
          >
            Read Message
          </h1>
        </div>

        {/* CARD AREA */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            {/* TOP QUOTE (outline style) */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "10px",
                fontSize: "3.5rem",
                color: "transparent",
                WebkitTextStroke: "2px #050756",
                fontFamily: "serif",
                zIndex: 2,
              }}
            >
              “
            </div>

            {/* CARD */}
            <div
              style={{
                width: "100%",
                height: "20rem",
                backgroundColor: "#F2B6B6",
                borderRadius: "0.5rem",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* BIG SOFT CIRCLE */}
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                }}
              />

              <div style={{ zIndex: 2 }}>
                <h2
                  style={{
                    fontFamily: "Geologica, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  Message
                </h2>

                <p
                  style={{
                    fontFamily: "Geologica, sans-serif",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  {loading && "Loading..."}
                  {error && error}
                  {!loading && !error && (message ? message.content : "No messages yet.")}


                </p>
              </div>
            </div>

            {/* BOTTOM QUOTE */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "10px",
                fontSize: "3.5rem",
                color: "transparent",
                WebkitTextStroke: "2px #050756",
                fontFamily: "serif",
              }}
            >
              ”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}