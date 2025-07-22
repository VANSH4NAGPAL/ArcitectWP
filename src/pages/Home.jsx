import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "../App.css";
import { useGSAP } from "@gsap/react";

function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Hide loader only when video is loaded.
  useEffect(() => {
    if (videoLoaded) {
      setProgress(100); // Ensure it completes
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Brief delay for smoother transition
      return () => clearTimeout(timer);
    }
  }, [videoLoaded]);

  // GSAP animations should run only after loading is finished.
  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1️⃣ Logo Reveal
    tl.fromTo(
      "#logo",
      {
        clipPath: "inset(0% 50% 0% 50%)",
        opacity: 0,
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 0.5,
        duration: 1.2,
      }
    );

    // 2️⃣ Navbar Reveal
    tl.fromTo(
      ".navbar",
      {
        opacity: 0,
        y: -20,
        duration: 0.6,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6, // Overlap with logo reveal
      }
    );

    // 3️⃣ Overlay Toggle Reveal
    // Removed overlay-toggle animation
  }, [loading]);

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration || video.buffered.length === 0) return;

    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;
    const progressPercentage = (bufferedEnd / duration) * 100;
    setProgress(Math.round(progressPercentage));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* ⏳ Loader */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-1 bg-slate-600"
              style={{
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-3 tracking-widest">{progress}%</p>
        </div>
      )}

      {/* Page Content: Hidden while loading */}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        {/* 🖼️ Centered Logo as Watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <img
            src="/logofullw.png"
            alt="StudioDesignPalette Logo"
            className="w-110 max-w-3xl opacity-10 select-none"
            style={{
              userSelect: "none",
            }}
            draggable="false"
            id="logo"
          />
        </div>
      </div>

      {/* 🎬 Video Background: Always rendered to allow loading */}
      <div
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{
          visibility: loading ? "hidden" : "visible",
          opacity: loading ? 0 : 1,
          transition: "visibility 0s, opacity 0.5s linear",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/bg-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          onProgress={handleProgress}
        />
      </div>
    </div>
  );
}

export default Home;
