"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export default function EventSlider() {
  const currentSlideRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const touchStartY = useRef(0);

  /** Helper: get image URL */
  function getImgUrl(num: number) {
    return `/images/${num}.jpg`;
  }

  /** Helper: create slide element */
  function createSlide(slideNumber: number, direction: string) {
    const slide = document.createElement("div");
    slide.className = "slide";

    const slideBgImg = document.createElement("div");
    slideBgImg.className = "slide-bg-img";

    const img = document.createElement("img");
    img.src = getImgUrl(slideNumber);
    slideBgImg.appendChild(img);
    slide.appendChild(slideBgImg);

    slideBgImg.style.clipPath =
      direction === "down"
        ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
        : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

    return slide;
  }

  /** Helper: create main image wrapper */
  function createMainImageWrapper(slideNumber: number, direction: string) {
    const wrapper = document.createElement("div");
    wrapper.className = "slide-main-img-wrapper";

    const img = document.createElement("img");
    img.src = getImgUrl(slideNumber);
    wrapper.appendChild(img);

    wrapper.style.clipPath =
      direction === "down"
        ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
        : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";

    return wrapper;
  }

  /** Helper: create text elements */
  function createTextElements(slideNumber: number, direction: string) {
    const event = events[slideNumber - 1];

    const newTitle = document.createElement("h1");
    newTitle.textContent = event.name;
    gsap.set(newTitle, { y: direction === "down" ? 50 : -50 });

    const newDescription = document.createElement("p");
    newDescription.textContent = event.description;
    newDescription.className = "split-description";
    gsap.set(newDescription, { y: direction === "down" ? 20 : -20 });

    const newCounter = document.createElement("p");
    newCounter.textContent = String(slideNumber);
    gsap.set(newCounter, { y: direction === "down" ? 18 : -18 });

    return [newTitle, newDescription, newCounter] as const;
  }

  /** Animate slide */
  function animateSlide(direction: string, targetIndex?: number) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    if (targetIndex !== undefined) {
      currentSlideRef.current = targetIndex;
    } else {
      currentSlideRef.current =
        direction === "down"
          ? currentSlideRef.current === events.length
            ? 1
            : currentSlideRef.current + 1
          : currentSlideRef.current === 1
          ? events.length
          : currentSlideRef.current - 1;
    }

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

    const newSlide = createSlide(currentSlideRef.current, direction);
    const newMainWrapper = createMainImageWrapper(currentSlideRef.current, direction);
    const [newTitle, newDescription, newCounter] = createTextElements(currentSlideRef.current, direction);

    gsap.set(newDescription, { clearProps: "all" });

    slider.appendChild(newSlide);
    mainImageContainer.appendChild(newMainWrapper);
    titleContainer.appendChild(newTitle);
    descriptionContainer.appendChild(newDescription);
    counterContainer.appendChild(newCounter);

    gsap.set(newMainWrapper.querySelector("img"), {
      y: direction === "down" ? "-50%" : "50%",
    });

    gsap.timeline({
      onComplete: () => {
        [currentSlideElement, currentMainWrapper, currentTitle, currentCounter, currentDescription].forEach(el =>
          el?.remove()
        );
        isAnimatingRef.current = false;
      },
    })
      .to(newSlide.querySelector(".slide-bg-img"), {
        clipPath:
          direction === "down"
            ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: CustomEase.create("custom", ".87, 0, .13, 1"),
      }, 0)
      .to(currentSlideElement.querySelector("img"), {
        scale: 1.5,
        duration: 1,
        ease: CustomEase.create("custom", ".87, 0, .13, 1"),
      }, 0)
      .to(newMainWrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: CustomEase.create("custom", ".87, 0, .13, 1"),
      }, "<")
      .to(newMainWrapper.querySelector("img"), {
        y: "0%",
        duration: 1,
        ease: CustomEase.create("custom", ".87, 0, .13, 1"),
      }, 0)
      .to(currentTitle, { y: direction === "down" ? -50 : 50, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0)
      .to(newTitle, { y: 0, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0)
      .to(currentDescription, { y: direction === "down" ? -20 : 20, opacity: 0, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0)
      .to(newDescription, { y: 0, opacity: 1, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0)
      .to(currentCounter, { y: direction === "down" ? -18 : 18, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0)
      .to(newCounter, { y: 0, duration: 1, ease: CustomEase.create("custom", ".87, 0, .13, 1") }, 0);
  }

  /** Handle scroll/touch */
  useEffect(() => {
    let lastScrollTime = 0;

    const handleScroll = (direction: string) => {
      const now = Date.now();
      if (isAnimatingRef.current) return;
      if (now - lastScrollTime < 1000) return;
      lastScrollTime = now;
      animateSlide(direction);
    };

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY > 0 ? "down" : "up");
    };

    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) > 10) handleScroll(dy > 0 ? "down" : "up");
    };

    const touchStartHandler = (e: TouchEvent) => (touchStartY.current = e.touches[0].clientY);

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  return (
    <>
      <div className="events-footer">
        <p>All Projects</p>
        <div className="slider-counter">
          <div className="count"><p>1</p></div>
          <p>/ {events.length}</p>
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
            <img src="/images/1.jpg" alt="" />
          </div>
        </div>

        <div className="slide-copy">
          <div className="slide-title">
            <h1>{events[0].name}</h1>
          </div>
          <div className="slide-description">
            <p>{events[0].description}</p>
          </div>
        </div>

        {/* Timeline buttons */}
{/* Desktop Timeline Buttons */}
<div className="slider-timeline">
  {events.map((event, index) => (
    <button
      key={index}
      onClick={() =>
        animateSlide(index + 1 > currentSlideRef.current ? "down" : "up", index + 1)
      }
      className={currentSlideRef.current === index + 1 ? "active" : ""}
    >
      {event.name}
    </button>
  ))}
</div>

{/* Mobile Timeline Dropdown */}
<div className="slider-timeline-mobile">
  <select
    value={currentSlideRef.current}
    onChange={(e) =>
      animateSlide(
        Number(e.target.value) > currentSlideRef.current ? "down" : "up",
        Number(e.target.value)
      )
    }
  >
    {events.map((event, index) => (
      <option key={index} value={index + 1}>
        {event.name}
      </option>
    ))}
  </select>
</div>
      </div>
    </>
  );
}

/** Events Array */
const events = [
  { name: "TurnCoat Debate", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in nulla sed augue bibendum varius." },
  { name: "Ecologic Models", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec arcu sed urna suscipit finibus." },
  { name: "RoboMaze", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet felis in purus dapibus tincidunt." },
  { name: "Rube Goldberg Machine", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Nulla facilisi." },
  { name: "ChemCraft 3D", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec felis ac elit vehicula pretium." },
  { name: "ChemSense", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien ut sapien fermentum volutpat." },
  { name: "GameCraft", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porttitor justo vitae lacus faucibus, vitae egestas magna rutrum." },
  { name: "Virtue Vibes", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget libero ac lacus lacinia varius." },
  { name: "Webolution", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit, lectus ut aliquam sagittis, nibh velit dignissim magna." },
  { name: "CrypteX", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec neque vel nisi tincidunt sodales." },
  { name: "Top Coders", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod, libero eget pretium porttitor." },
  { name: "Battle of Brains", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. Mauris nec felis." },
  { name: "GameSpark", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel justo eu nisl dignissim malesuada." },
  { name: "Budgetarium", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies, est a tempus mattis." },
  { name: "Bid Blitz", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis ligula non risus porttitor, vel egestas orci commodo." },
];
