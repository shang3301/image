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
          <p>वसुधैव कुटुम्बकम</p>
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
        </div>

        {/* Trailer loads after 4 seconds */}
        <div className="landing-card">
          <img src="images/flex.png" alt="hero" />
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
