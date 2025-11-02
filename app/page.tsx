"use client";
import React, { useEffect, useState } from "react";
import LandingAnimation from "@/components/landinganimation";

export default function Home() {
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // ⏳ Wait 4 seconds, then show iframe
    const timer = setTimeout(() => setShowTrailer(true), 3300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing">
      <LandingAnimation />

      {/* Preloader */}
      <div className="landing-preloader">
        <div className="landing-intro-title">
          <h1>IMAGE</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Split Overlay */}
      <div className="landing-split-overlay">
        <div className="landing-intro-title">
          <h1>IMAGE</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Tags */}
      <div className="landing-tags-overlay">
        <div className="landing-tag landing-tag-1">
          <p>Vasudhaiva Kutumbakam</p>
        </div>
        <div className="landing-tag landing-tag-2">
          <p>A Festival of Interschool Competitions</p>
        </div>
        <div className="landing-tag landing-tag-3">
          <p>November 19 & 20, 2025</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="landing-container">
        <div className="landing-hero-img">
          <img src="images/2.jpg" alt="background" />
        </div>

        {/* Trailer loads after 4 seconds */}
        <div className="landing-card">
          {showTrailer && (
            <iframe
              src="https://player.vimeo.com/video/1132866617?autoplay=1&muted=1&background=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Image Trailer"
              style={{ width: "100%", height: "100%" }}
            ></iframe>
          )}
        </div>

        <div className="register">
          <p>
            <a href="https://linktr.ee/Image_2025">Register Here !</a>
          </p>
        </div>
      </div>
    </div>
  );
}
