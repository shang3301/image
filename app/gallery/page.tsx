"use client";
import React, { useEffect } from "react";
import InfiniteGallery from "@/components/infinitegallery";

declare global {
  interface Window {
    items: { title: string; description: string }[];
  }
}

const Events: React.FC = () => {
  useEffect(() => {
    window.items = [
      {
        title: "Chromatic Loopscape",
        description:
          "A hypnotic cycle of color and rhythm, representing the endless dance of digital expression.",
      },
      {
        title: "Solar Bloom",
        description:
          "Inspired by the sun's radiant burst, this piece captures the energetic pulse of celestial beauty.",
      },
      {
        title: "Neon Handscape",
        description:
          "A surreal vision where light and touch collide, forming electric impressions of the modern world.",
      },
      {
        title: "Echo Discs",
        description:
          "Ripples of memory spread through time, capturing echoes of forgotten signals and silent songs.",
      },
      {
        title: "Void Gaze",
        description:
          "Staring into the unknown, this piece invites reflection in the depths of emptiness and mystery.",
      },
      {
        title: "Gravity Sync",
        description:
          "Abstract forces align and collapse, simulating the delicate balance of motion and tension.",
      },
      {
        title: "Heat Core",
        description:
          "A visual core of thermal intensity, radiating energy like a digital heart under pressure.",
      },
      {
        title: "Fractal Mirage",
        description:
          "Infinite complexity in a finite moment, revealing hidden geometries in digital illusions.",
      },
      {
        title: "Nova Pulse",
        description:
          "Exploding with stellar rhythm, it captures the heartbeat of a newly born star.",
      },
      {
        title: "Sonic Horizon",
        description:
          "Where sound meets silence, this piece visualizes the boundary of audible imagination.",
      },
      {
        title: "Dream Circuit",
        description:
          "Neural paths mapped through dreams, revealing subconscious data loops in motion.",
      },
      {
        title: "Lunar Mesh",
        description:
          "A woven grid of moonlight textures, balancing science fiction and cosmic beauty.",
      },
      {
        title: "Radiant Dusk",
        description:
          "The last light of day caught in pixelated motion, fading into shadowed brilliance.",
      },
      {
        title: "Pixel Drift",
        description:
          "A digital abstraction of entropy, where form and color begin to dissolve into noise.",
      },
      {
        title: "Vortex Bloom",
        description:
          "A swirling burst of life and motion, where chaos meets creation in fluid geometry.",
      },
      {
        title: "Shadow Static",
        description:
          "Darkness isn't silent—it hisses. This visual captures the subtle noise of night.",
      },
      {
        title: "Crimson Phase",
        description:
          "A blood-red transition, symbolizing the cycle of change in identity and perception.",
      },
      {
        title: "Retro Cascade",
        description:
          "Falling through memories, this is a nostalgic dive into vintage palettes and glitch trails.",
      },
      {
        title: "Photon Fold",
        description:
          "Light bends and folds upon itself, forming impossible patterns within space-time fabric.",
      },
      {
        title: "Zenith Flow",
        description:
          "A smooth climb toward peak clarity, visualizing mental stillness in kinetic form.",
      },
    ];
  }, []);

  return (
    <div className="gallery-container">
      <InfiniteGallery />
    </div>
  );
};

export default Events;
