"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export default function EventSlider() {
  useEffect(() => {
    const totalSlides = 7;
    let currentSlide = 1;
    let isAnimating = false;
    let scrollAllowed = true;
    let lastScrollTime = 0;
    let touchStartY = 0;

    const slideTitles = [
      "Field Unit", "Astral Convergence", "Eclipse Core",
      "Luminous", "Serenity", "Nebula Point", "Horizon"
    ];

    const slideDescriptions = [
      "Concept Art", "Soundscape", "Experimental Tour",
      "Editorial", "Music Video", "VFX", "Set Design"
    ];

    const getImgUrl = (num: number) => `/images/${num}.jpg`;

    function createSlide(slideNumber: number, direction: string) {
      const slide = document.createElement("div");
      slide.className = "slide";

      const slideBgImg = document.createElement("div");
      slideBgImg.className = "slide-bg-img";

      const img = document.createElement("img");
      img.src = getImgUrl(slideNumber);
      slideBgImg.appendChild(img);
      slide.appendChild(slideBgImg);

      slideBgImg.style.clipPath = direction === "down"
        ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
        : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

      return slide;
    }

    function createMainImageWrapper(slideNumber: number, direction: string) {
      const wrapper = document.createElement("div");
      wrapper.className = "slide-main-img-wrapper";

      const img = document.createElement("img");
      img.src = getImgUrl(slideNumber);
      wrapper.appendChild(img);

      wrapper.style.clipPath = direction === "down"
        ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";

      return wrapper;
    }

    function createTextElements(slideNumber: number, direction: string) {
      const newTitle = document.createElement("h1");
      newTitle.textContent = slideTitles[slideNumber - 1];
      gsap.set(newTitle, { y: direction === "down" ? 50 : -50 });

      const newDescription = document.createElement("p");
      newDescription.textContent = slideDescriptions[slideNumber - 1];
      newDescription.className = "split-description";
      gsap.set(newDescription, { y: direction === "down" ? 20 : -20 });

      const newCounter = document.createElement("p");
      newCounter.textContent = String(slideNumber);
      gsap.set(newCounter, { y: direction === "down" ? 18 : -18 });

      return [newTitle, newDescription, newCounter];
    }

    function animateSlide(direction: string) {
      if (isAnimating || !scrollAllowed) return;
      isAnimating = true;
      scrollAllowed = false;

      const slider = document.querySelector(".slider")!;
      const currentSlideElement = slider.querySelector(".slide")!;
      const mainImageContainer = document.querySelector(".slide-main-img")!;
      const currentMainWrapper = mainImageContainer.querySelector(".slide-main-img-wrapper")!;

      const titleContainer = document.querySelector(".slide-title")!;
      const descriptionContainer = document.querySelector(".slide-description")!;
      const counterContainer = document.querySelector(".count")!;

      const currentTitle = titleContainer.querySelector("h1")!;
      const currentDescription = Array.from(descriptionContainer.querySelectorAll("p")).at(-1)!;
      const currentCounter = counterContainer.querySelector("p")!;

      currentSlide = direction === "down"
        ? currentSlide === totalSlides ? 1 : currentSlide + 1
        : currentSlide === 1 ? totalSlides : currentSlide - 1;

      const newSlide = createSlide(currentSlide, direction);
      const newMainWrapper = createMainImageWrapper(currentSlide, direction);
      const [newTitle, newDescription, newCounter] = createTextElements(currentSlide, direction);

      // Clear previous transform styles
      gsap.set(newDescription, { clearProps: "all" });

      slider.appendChild(newSlide);
      mainImageContainer.appendChild(newMainWrapper);
      titleContainer.appendChild(newTitle);
      descriptionContainer.appendChild(newDescription);
      counterContainer.appendChild(newCounter);

      gsap.set(newMainWrapper.querySelector("img"), {
        y: direction === "down" ? "-50%" : "50%"
      });

      gsap.timeline({
        onComplete: () => {
          [currentSlideElement, currentMainWrapper, currentTitle, currentCounter, currentDescription].forEach(el => el?.remove());
          isAnimating = false;
          setTimeout(() => scrollAllowed = true, 100);
        }
      })
        .to(newSlide.querySelector(".slide-bg-img"), {
          clipPath: direction === "down"
            ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(currentSlideElement.querySelector("img"), {
          scale: 1.5,
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(newMainWrapper, {
          clipPath: direction === "down"
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, "<")
        .to(newMainWrapper.querySelector("img"), {
          y: "0%",
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(currentTitle, {
          y: direction === "down" ? -50 : 50,
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(newTitle, {
          y: 0,
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(currentCounter, {
          y: direction === "down" ? -18 : 18,
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0)
        .to(newCounter, {
          y: 0,
          duration: 1.00,
          ease: CustomEase.create("custom", ".87, 0, .13, 1")
        }, 0);
    }

    function handleScroll(direction: string) {
      const now = Date.now();
      if (isAnimating || !scrollAllowed) return;
      if (now - lastScrollTime < 1000) return;
      lastScrollTime = now;
      animateSlide(direction);
    }

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? "down" : "up";
      handleScroll(direction);
    };

    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) > 10) {
        handleScroll(dy > 0 ? "down" : "up");
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("touchstart", e => touchStartY = e.touches[0].clientY);
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  return (
    <>
      <div className="events-footer">
        <p>All Projects</p>
        <div className="slider-counter">
          <div className="count"><p>1</p></div>
          <p>/ 7</p>
        </div>
      </div>

      <div className="slider">
        <div className="slide">
          <div className="slide-bg-img">
            <img src="/images/1.jpg" alt="" />
          </div>
        </div>

        <div className="slide-main-img">
          <div className="slide-main-img-wrapper">
            <img src="/images/2.jpg" alt="" />
          </div>
        </div>

        <div className="slide-copy">
          <div className="slide-title">
            <h1>Field Unit</h1>
          </div>
          <div className="slide-description">
            <p>Concept Art</p>
          </div>
        </div>
      </div>
    </>
  );
}
