"use client"
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTransitionRouter } from "next-view-transitions";
import Cursor from "@/components/cursor";

const Menu = () => {
  const containerRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuPreviewImgRef = useRef(null);
  const menuOpenRef = useRef(null);
  const menuCloseRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useTransitionRouter();

  useLayoutEffect(() => {
    if (menuPreviewImgRef.current) {
      resetPreviewImage();
    }
  }, []);

  const animateMenuToggle = (isOpening) => {
    const open = menuOpenRef.current;
    const close = menuCloseRef.current;
    gsap.to(isOpening ? open : close, {
      x: isOpening ? -5 : 5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(isOpening ? close : open, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const cleanupPreviewImages = () => {
    const container = menuPreviewImgRef.current;
    if (!container) return;
    const images = container.querySelectorAll("img");
    if (images.length > 3) {
      for (let i = 0; i < images.length - 3; i++) {
        container.removeChild(images[i]);
      }
    }
  };

  const resetPreviewImage = () => {
    const container = menuPreviewImgRef.current;
    if (!container) return;
    container.innerHTML = "";
    const img = document.createElement("img");
    img.src = "images/brochure.png";
    img.alt = "";
    container.appendChild(img);
  };

  const openMenu = () => {
    if (isAnimating || isOpen) return;

    setIsAnimating(true);
    gsap.to(containerRef.current, {
      rotation: 10,
      x: 300,
      y: 450,
      scale: 1.5,
      duration: 1.25,
      ease: "power4.inOut",
    });
    animateMenuToggle(true);
    gsap.to(menuContentRef.current, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });
    gsap.to([".link a", ".social a"], {
      y: "0%",
      opacity: 1,
      duration: 1,
      delay: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        setIsOpen(true);
        setIsAnimating(false);
      },
    });
  };

  const closeMenu = () => {
    if (isAnimating || !isOpen) return;
    setIsAnimating(true);
    gsap.to(containerRef.current, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });
    animateMenuToggle(false);
    gsap.to(menuContentRef.current, {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut",
    });
    gsap.to(menuOverlayRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        setIsOpen(false);
        setIsAnimating(false);
        gsap.set([".link a", ".social a"], { y: "120%" });
        resetPreviewImage();
      },
    });
  };

const handleHover = (imgSrc) => {
  if (!isOpen || isAnimating || !imgSrc) return;
  const container = menuPreviewImgRef.current;
  if (!container) return;

  // 🧹 Remove brochure image if it exists
  const brochureImg = container.querySelector('img[src*="brochure.png"]');
  if (brochureImg) brochureImg.remove();

  const images = container.querySelectorAll("img");
  const lastImg = images[images.length - 1];
  if (lastImg && lastImg.src.endsWith(imgSrc)) return;

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = "";
  img.style.opacity = "0";
  img.style.transform = "scale(1.25) rotate(10deg)";
  img.style.objectFit = "cover"; // 👈 ensure hover images fill nicely
  container.appendChild(img);

  cleanupPreviewImages();

  gsap.to(img, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 0.75,
    ease: "power2.out",
  });
};

  return (
    <div className="menu">
      <Cursor />
      <nav className="transparent-nav">
        <div className="logo">
          <a href="#">Image</a>
        </div>
        <div
          className="menu-toggle"
          onClick={() => (isOpen ? closeMenu() : openMenu())}
        >
          <p id="menu-open" ref={menuOpenRef}>
            Menu
          </p>
          <p id="menu-close" ref={menuCloseRef}>
            Close
          </p>
        </div>
      </nav>

      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-content" ref={menuContentRef}>
          <div className="menu-items">
            <div className="col-lg">
              <div className="menu-preview-img" ref={menuPreviewImgRef}></div>
            </div>
            <div className="col-sm">
              <div className="menu-links">
                {[      
                  { label: "Home", img: "images/gallery/6.jpg", href: "./" },
                  { label: "Events", img: "images/gallery/9.jpg", href: "./events" },
                  { label: "Gallery", img: "images/gallery/12.jpg", href: "./gallery" },
                  {/*{ label: "Team", img: "images/15.jpg", href: "./team" },*/}
                ].map(({ label, img, href = "#" }) => (
                  <div className="link" key={label}>
                    <a
                      href={href}
                      data-img={img}
                      onMouseOver={() => handleHover(img)}
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>

              <div className="menu-socials">
                {[
                  { name: "Linktree", link: "https://linktr.ee/Image_2025" },
                  { name: "Brochure", link: "https://bit.ly/Image2025" },
                  { name: "Youtube", link: "https://www.youtube.com/@CAMBRIDGESCHOOLNoida" },
                  {
                    name: "Instagram",
                    link: "https://instagram.com/cambridgenoida",
                  },
                  {
                    name: "Facebook",
                    link: "https://www.facebook.com/Imagine.Explore.Discover.Grow.Soar",
                  },
                ].map(({ name, link }) => (
                  <div className="social" key={name}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="menu-footer">
            <div className="col-lg">
              <a href="#"></a>
            </div>
            <div className="col-sm">
              <a href="#">वसुधैव</a>
              <a href="#">कुटुम्बकम</a>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default Menu;
