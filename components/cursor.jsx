"use client";

import React, { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

const moveCursor = (e) => {
  const cursorSize = cursor.offsetWidth / 2; // half of current width
  cursor.style.left = `${e.clientX - cursorSize}px`;
  cursor.style.top = `${e.clientY - cursorSize}px`;
};


    const handleHover = () => cursor.classList.add("hovered");
    const handleLeave = () => cursor.classList.remove("hovered");

    window.addEventListener("mousemove", moveCursor);
    document.querySelectorAll("button, a, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.querySelectorAll("button, a, input, textarea").forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return <div className="inverted-cursor" ref={cursorRef}></div>;
}
