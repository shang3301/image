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
    return `/images/${num}.png`;
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
    const event = allevents[slideNumber - 1];

    const newTitle = document.createElement("h1");
    newTitle.textContent = event.name;
    gsap.set(newTitle, { y: direction === "down" ? 50 : -50 });

    const newDescription = document.createElement("p");
    newDescription.innerHTML = event.description;
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
          ? currentSlideRef.current === allevents.length
            ? 1
            : currentSlideRef.current + 1
          : currentSlideRef.current === 1
          ? allevents.length
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

  useEffect(() => {
  // Run only once — ensure first slide is visible
  const firstSlideImg = document.querySelector(".slide-main-img-wrapper img") as HTMLImageElement;
  if (firstSlideImg) {
    gsap.set(firstSlideImg, { y: "0%", scale: 1 });
  }

  const firstSlideBg = document.querySelector(".slide-bg-img") as HTMLElement;
  if (firstSlideBg) {
    gsap.set(firstSlideBg, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });
  }

  const firstWrapper = document.querySelector(".slide-main-img-wrapper") as HTMLElement;
  if (firstWrapper) {
    gsap.set(firstWrapper, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });
  }
}, []);

  return (
    <>
      <div className="events-footer">
        <p>All Projects</p>
        <div className="slider-counter">
          <div className="count"><p>1</p></div>
          <p>/ {allevents.length}</p>
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
            <p dangerouslySetInnerHTML={{ __html: events[0].description }} />
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
{/* Desktop Timeline Buttons */}
<div className="slider-timeline-2">
  {alsoevents.map((event, index) => (
    <button
      key={index}
      onClick={() =>
        animateSlide(index + events.length + 1 > currentSlideRef.current ? "down" : "up", index + events.length + 1)
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
    {mobilevents.map((event, index) => (
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

const mobilevents = [
  {
    name: "Symphony",
    description: `A western music competition for classes IX–XII, where teams perform a self-composed or improvised English song using only live instruments — no backing tracks or autotune.<br></br>
Participants must announce their song and artist before performing. The event emphasizes vocal quality, instrumental synchronization, and creative arrangement.<br></br>
Judged on: Vocal performance, instrumental skills, stage presence, and overall audience engagement.<br></br>
<a href="https://forms.gle/sahitZNqHFSCtue57" target="_blank">Click here to register</a>`
  },
  {
    name: "Nrityanjali",
    description: `Fusion dance competition for classes III–V combining folk and western dance forms of one Indian state.<br></br>
Participants must maintain cultural authenticity in costumes and choreography — no film songs or inappropriate moves are allowed. Props and digital backgrounds are prohibited.<br></br>
Judged on: Dance technique, choreography, group coordination, costume, and overall presentation.<br></br>
<a href="https://forms.gle/dB8F45DLNrek3sv67" target="_blank">Click here to register</a>`
  },
  {
    name: "Sur Sangam",
    description: `A beautiful blend of Indian Classical/Light and Western music for classes III–V. Teams present a unique fusion piece that integrates ragas with western lyrics or instruments.<br></br>
Only live instruments are allowed; no background music or karaoke tracks. Participants must perform in kurta-pyjama attire.<br></br>
Judged on: Composition, melody, rhythm, and synchronization between Indian and Western elements.<br></br>
<a href="https://forms.gle/qzpSE3o5DUSpXjQ76" target="_blank">Click here to register</a>`
  },
  {
    name: "Kitchen Geniuses",
    description: `A creative cooking competition for classes IV–V. Teams prepare a healthy, nutritious platter within 45 minutes, bringing pre-chopped ingredients and presenting it attractively.<br></br>
The dish must have an original name and be accompanied by a display card of ingredients and nutritional value.<br></br>
Judged on: Neatness, creativity, nutritional value, taste, and knowledge of ingredients.<br></br>
<a href="https://forms.gle/EjN5ntHr33yVE4SB6" target="_blank">Click here to register</a>`
  },
  {
    name: "TED Talk",
    description: `Public speaking challenge for classes IX–XII where students deliver a 4–5 minute TED-style talk on the theme “Global Diversity: Problems and Possibilities in the Modern World”.<br></br>
Participants are encouraged to use personal stories or real-life examples and must present original content only.<br></br>
Judged on: Clarity of message, insight, delivery, and audience engagement.<br></br>
<a href="https://forms.gle/H4yxgbTzDV7SRjAE8" target="_blank">Click here to register</a>`
  },
  {
    name: "बातों–बातों में",
    description: `A Hindi podcast competition for classes VIII–IX. Participants record a short podcast on themes such as “विश्वशांति”, “पर्यावरण संरक्षण”, or “हमारे बुजुर्ग: हमारी धरोहर”.<br></br>
The podcast must be original, fact-based, and expressive. Proper voice modulation and fluency are key to scoring well.<br></br>
Judged on: Content originality, fluency, confidence, and pronunciation.<br></br>
<a href="https://forms.gle/WEnHg3S8CA4PHnFg8" target="_blank">Click here to register</a>`
  },
  {
    name: "Poetic Fantasy",
    description: `An English poetry writing contest for classes VI–VIII based on the theme “Peace and Harmony”.<br></br>
Students are given 20 words and must use at least 10 in their original poem of 20–25 lines, neatly written and creatively expressed.<br></br>
Judged on: Theme relevance, poetic style, vocabulary, and presentation.<br></br>
<a href="https://forms.gle/UtmwbW3j8n6Mb65i6" target="_blank">Click here to register</a>`
  },
  {
    name: "Sanskrit Shloka",
    description: `Chanting competition for classes VI–VIII celebrating traditional Sanskrit literature.<br></br>
Participants choose and present shlokas emphasizing pronunciation, rhythm, and expression. Use of Indian instruments is optional.<br></br>
Judged on: Pronunciation, confidence, melody, and presentation style.<br></br>
<a href="https://forms.gle/vY4SR7zeCYjvT6R9A" target="_blank">Click here to register</a>`
  },
  {
    name: "Chitrashala",
    description: `Junior Art Competitions for classes III–V featuring three sub-events:<br></br>
- “Reimagine & Recreate” (Recycling Art)<br>
- “Paper Montage” (Collage Creation)<br>
- “Canvas Painting” (We Are All Connected)<br>
Students express creativity using sustainable materials while promoting eco-consciousness.<br>
Judged on: Originality, creativity, neatness, and theme relevance.<br></br>
<a href="https://forms.gle/a6VVFdMtfJ3J9baU9" target="_blank">Click here to register</a>`
  },
  {
    name: "Aesthetic Moves",
    description: `Senior Art Competitions for classes VI–XII, featuring:<br></br>
- Indian Renaissance Impact (Watercolor)<br></br>
- Statuette (Clay Modelling)<br></br>
- Impressionist Landscape (Knife Painting)<br></br>
- Aesthetical Expression (Pop Art)<br></br>
Encourages visual storytelling and artistic depth through themed techniques.<br></br>
Judged on: Originality, colour harmony, relevance to theme, and artistic execution.<br></br>
<a href="https://forms.gle/pPNvAaehx8XEtWqz6" target="_blank">Click here to register</a>`
  },
  {
    name: "GameCraft",
    description: `Coding competition for classes IV–VI using Scratch 3.0 Offline Editor. Participants create interactive games on a topic revealed on the spot.<br></br>
Games should be simple, educational, and visually appealing.<br></br>
Judged on: Creativity, gameplay, design, and educational value.<br></br>
<a href="https://forms.gle/StuvutrWQVWrdxfh9" target="_blank">Click here to register</a>`
  },
  {
    name: "Webolution",
    description: `Web development event for classes IX–XII where teams create responsive websites using HTML, CSS, and JavaScript.<br></br>
Projects must include at least four pages and interactive elements such as forms or animations.<br></br>
Judged on: Design, functionality, coding practices, and originality.<br></br>
<a href="https://forms.gle/oz2yGNRKFSkqxqcYA" target="_blank">Click here to register</a>`
  },
  {
    name: "CrypteX",
    description: `A thrilling 24-hour online cryptic hunt on Discord for classes IX–XII. Participants decode clues hidden in images, riddles, and web trails to advance levels.<br></br>
Google is the only ally in this high-speed puzzle chase.<br></br>
Judged on: Logical reasoning, speed, and problem-solving.<br></br>
<a href="https://forms.gle/YCmg6FCPSDfUMcAd8" target="_blank">Click here to register</a>`
  },
  {
    name: "ChemCraft 3D",
    description: `Science-meets-design event for classes X–XII. Teams create 3D molecular models in Blender and submit a report covering structure, geometry, and uses.<br></br>
Combines chemistry knowledge with visualization skills.<br></br>
Judged on: Scientific accuracy, creativity, and report quality.<br></br>
<a href="https://forms.gle/WhTVh3jPKwKg9r587" target="_blank">Click here to register</a>`
  },
  {
    name: "Vista View",
    description: `A sustainability-driven art event for classes IX–XII. Teams design a 3D wall installation using waste materials under the theme “Waste to Art for Sustainable Creation”.<br></br>
Encourages upcycling and artistic innovation.<br></br>
Judged on: Creativity, originality, and thematic relevance.<br></br>
<a href="https://forms.gle/uR55HQSbNumMRY526" target="_blank">Click here to register</a>`
  },
  {
    name: "Pulse WIthin",
    description: `A high-energy western dance competition for classes VI–IX. Teams perform expressive and theme-based dances to pre-recorded music that reflects rhythm, creativity, and synchronization.<br></br>
Costumes must be appropriate, and Bollywood tracks are not allowed. Props may be used, but no phones or changing rooms are provided.<br></br>
Judged on: Choreography, expression, synchronization, creativity, and presentation.<br></br>
<a href="https://forms.gle/Y7SmWZ4zfLD2hhvP9" target="_blank">Click here to register</a>`
  },
  {
    name: "Nukkad Natak",
    description: `A Hindi street play competition for classes IV–V on the theme ‘एक सामंजस्यपूर्ण राष्ट्र’ (A Harmonious Nation). Students dramatize social issues promoting unity and national values.<br></br>
Teams must bring their own props. Use of fire or water on stage is strictly prohibited, and adult assistance is not allowed.<br></br>
Judged on: Dialogue delivery, expressions, theme relevance, and audience impact.<br></br>
<a href="https://forms.gle/vPUEhxMZUbKRRB5aA" target="_blank">Click here to register</a>`
  },
  {
    name: "Rube It Up!",
    description: `An engineering and creativity challenge for classes IX–XII where teams build a Rube Goldberg Machine — a chain reaction invention that performs a simple task in a complex and amusing way.<br></br>
Machines should be safe, stable, and within 1m³ size. The final task is to knock down a stack of paper cups using only mechanical reactions.<br></br>
Judged on: Creativity, complexity, engineering design, and presentation clarity.<br></br>
<a href="https://forms.gle/i2SQTMLGK39yQ3yB6" target="_blank">Click here to register</a>`
  },
  {
    name: "EcoInnovators",
    description: `A model-making event for classes VI–XI encouraging innovative solutions for sustainability. Teams create working models based on the theme “Innovation for a Greener and Sustainable Future”.<br></br>
Only biodegradable or recycled materials are allowed. Teams present their models within 5 minutes.<br></br>
Judged on: Creativity, scientific principle, practicality, and sustainability impact.<br></br>
<a href="https://forms.gle/VkHbceZZrPw3nz5q9" target="_blank">Click here to register</a>`
  },
  {
    name: "Reel Harmony",
    description: `A multimedia storytelling competition for classes VII–VIII. Participants create a 3-minute animated short film on a given topic using OpenShot software.<br></br>
Each team narrates their story live and synchronizes it with visuals, background music, and subtitles.<br></br>
Judged on: Creativity, technical execution, storytelling, and theme connection.<br></br>
<a href="https://forms.gle/Do2iPgwhqJRdQ8pE7" target="_blank">Click here to register</a>`
  },
  {
    name: "GameSpark",
    description: `A digital game design competition for classes IX–XII based on the theme “Duality – Two opposite forces coexist, and you must balance them”.<br></br>
Participants use Unity or Unreal Engine and present their game live to the judges. Games must be original and credited properly.<br></br>
Judged on: Originality, gameplay mechanics, creativity, and user experience.<br></br>
<a href="https://forms.gle/gxL3kqXmxEjCANtU7" target="_blank">Click here to register</a>`
  },
  {
    name: "Top Coders",
    description: `A programming contest for classes IX–XII testing problem-solving, logic, and coding efficiency in Python 3.13.<br></br>
Teams solve multiple coding challenges within 1 hour using only the software provided by the school.<br></br>
Judged on: Accuracy, efficiency, creativity in solutions, and clean code structure.<br></br>
<a href="https://forms.gle/5gr6zsz6gBUeqrEH9" target="_blank">Click here to register</a>`
  },
  {
    name: "IQrypt",
    description: `A science and technology quiz for classes IX–XII. Teams compete through written prelims and live finals covering topics from science, innovation, and current technology.<br></br>
Finalists face multiple rounds of diverse, fast-paced questions on emerging scientific trends.<br></br>
Judged on: Knowledge depth, teamwork, and quick thinking.<br></br>
<a href="https://forms.gle/Nbkx2jvWz8RuqHd18" target="_blank">Click here to register</a>`
  },
  {
    name: "Bid Blitz",
    description: `A commerce and strategy event for classes X–XII modeled after an auction game. Teams use virtual funds to bid for players strategically to build the best team lineup.<br></br>
Critical thinking, finance sense, and teamwork play key roles in success.<br></br>
Judged on: Auction strategy, budget balance, and final team composition.<br></br>
<a href="https://forms.gle/81U3stCbeXUuzJpz6" target="_blank">Click here to register</a>`
  },
];

const events = [
  {
    name: "Symphony",
    description: `A western music competition for classes IX–XII, where teams perform a self-composed or improvised English song using only live instruments — no backing tracks or autotune.<br></br>
Participants must announce their song and artist before performing. The event emphasizes vocal quality, instrumental synchronization, and creative arrangement.<br></br>
Judged on: Vocal performance, instrumental skills, stage presence, and overall audience engagement.<br></br>
<a href="https://forms.gle/sahitZNqHFSCtue57" target="_blank">Click here to register</a>`
  },
  {
    name: "Nrityanjali",
    description: `Fusion dance competition for classes III–V combining folk and western dance forms of one Indian state.<br></br>
Participants must maintain cultural authenticity in costumes and choreography — no film songs or inappropriate moves are allowed. Props and digital backgrounds are prohibited.<br></br>
Judged on: Dance technique, choreography, group coordination, costume, and overall presentation.<br></br>
<a href="https://forms.gle/dB8F45DLNrek3sv67" target="_blank">Click here to register</a>`
  },
  {
    name: "Sur Sangam",
    description: `A beautiful blend of Indian Classical/Light and Western music for classes III–V. Teams present a unique fusion piece that integrates ragas with western lyrics or instruments.<br></br>
Only live instruments are allowed; no background music or karaoke tracks. Participants must perform in kurta-pyjama attire.<br></br>
Judged on: Composition, melody, rhythm, and synchronization between Indian and Western elements.<br></br>
<a href="https://forms.gle/qzpSE3o5DUSpXjQ76" target="_blank">Click here to register</a>`
  },
  {
    name: "Kitchen Geniuses",
    description: `A creative cooking competition for classes IV–V. Teams prepare a healthy, nutritious platter within 45 minutes, bringing pre-chopped ingredients and presenting it attractively.<br></br>
The dish must have an original name and be accompanied by a display card of ingredients and nutritional value.<br></br>
Judged on: Neatness, creativity, nutritional value, taste, and knowledge of ingredients.<br></br>
<a href="https://forms.gle/EjN5ntHr33yVE4SB6" target="_blank">Click here to register</a>`
  },
  {
    name: "TED Talk",
    description: `Public speaking challenge for classes IX–XII where students deliver a 4–5 minute TED-style talk on the theme “Global Diversity: Problems and Possibilities in the Modern World”.<br></br>
Participants are encouraged to use personal stories or real-life examples and must present original content only.<br></br>
Judged on: Clarity of message, insight, delivery, and audience engagement.<br></br>
<a href="https://forms.gle/H4yxgbTzDV7SRjAE8" target="_blank">Click here to register</a>`
  },
  {
    name: "बातों–बातों में",
    description: `A Hindi podcast competition for classes VIII–IX. Participants record a short podcast on themes such as “विश्वशांति”, “पर्यावरण संरक्षण”, or “हमारे बुजुर्ग: हमारी धरोहर”.<br></br>
The podcast must be original, fact-based, and expressive. Proper voice modulation and fluency are key to scoring well.<br></br>
Judged on: Content originality, fluency, confidence, and pronunciation.<br></br>
<a href="https://forms.gle/WEnHg3S8CA4PHnFg8" target="_blank">Click here to register</a>`
  },
  {
    name: "Poetic Fantasy",
    description: `An English poetry writing contest for classes VI–VIII based on the theme “Peace and Harmony”.<br></br>
Students are given 20 words and must use at least 10 in their original poem of 20–25 lines, neatly written and creatively expressed.<br></br>
Judged on: Theme relevance, poetic style, vocabulary, and presentation.<br></br>
<a href="https://forms.gle/UtmwbW3j8n6Mb65i6" target="_blank">Click here to register</a>`
  },
  {
    name: "Sanskrit Shloka",
    description: `Chanting competition for classes VI–VIII celebrating traditional Sanskrit literature.<br></br>
Participants choose and present shlokas emphasizing pronunciation, rhythm, and expression. Use of Indian instruments is optional.<br></br>
Judged on: Pronunciation, confidence, melody, and presentation style.<br></br>
<a href="https://forms.gle/vY4SR7zeCYjvT6R9A" target="_blank">Click here to register</a>`
  },
  {
    name: "Chitrashala",
    description: `Junior Art Competitions for classes III–V featuring three sub-events:<br></br>
- “Reimagine & Recreate” (Recycling Art)<br>
- “Paper Montage” (Collage Creation)<br>
- “Canvas Painting” (We Are All Connected)<br>
Students express creativity using sustainable materials while promoting eco-consciousness.<br></br>
Judged on: Originality, creativity, neatness, and theme relevance.<br></br>
<a href="https://forms.gle/a6VVFdMtfJ3J9baU9" target="_blank">Click here to register</a>`
  },
  {
    name: "Aesthetic Moves",
    description: `Senior Art Competitions for classes VI–XII, featuring:<br></br>
- Indian Renaissance Impact (Watercolor)<br></br>
- Statuette (Clay Modelling)<br></br>
- Impressionist Landscape (Knife Painting)<br></br>
- Aesthetical Expression (Pop Art)<br></br>
Encourages visual storytelling and artistic depth through themed techniques.<br></br>
Judged on: Originality, colour harmony, relevance to theme, and artistic execution.<br></br>
<a href="https://forms.gle/pPNvAaehx8XEtWqz6" target="_blank">Click here to register</a>`
  },
  {
    name: "GameCraft",
    description: `Coding competition for classes IV–VI using Scratch 3.0 Offline Editor. Participants create interactive games on a topic revealed on the spot.<br></br>
Games should be simple, educational, and visually appealing.<br></br>
Judged on: Creativity, gameplay, design, and educational value.<br></br>
<a href="https://forms.gle/StuvutrWQVWrdxfh9" target="_blank">Click here to register</a>`
  },
  {
    name: "Webolution",
    description: `Web development event for classes IX–XII where teams create responsive websites using HTML, CSS, and JavaScript.<br></br>
Projects must include at least four pages and interactive elements such as forms or animations.<br></br>
Judged on: Design, functionality, coding practices, and originality.<br></br>
<a href="https://forms.gle/oz2yGNRKFSkqxqcYA" target="_blank">Click here to register</a>`
  }
];

const alsoevents = [
  {
    name: "CryteX",
    description: `A thrilling 24-hour online cryptic hunt on Discord for classes IX–XII. Participants decode clues hidden in images, riddles, and web trails to advance levels.<br></br>
Google is the only ally in this high-speed puzzle chase.<br></br>
Judged on: Logical reasoning, speed, and problem-solving.<br></br>
<a href="https://forms.gle/YCmg6FCPSDfUMcAd8" target="_blank">Click here to register</a>`
  },
  {
    name: "ChemCraft 3D",
    description: `Science-meets-design event for classes X–XII. Teams create 3D molecular models in Blender and submit a report covering structure, geometry, and uses.<br></br>
Combines chemistry knowledge with visualization skills.<br></br>
Judged on: Scientific accuracy, creativity, and report quality.<br></br>
<a href="https://forms.gle/WhTVh3jPKwKg9r587" target="_blank">Click here to register</a>`
  },
  {
    name: "Elan: Pulse WIthin",
    description: `A high-energy western dance competition for classes VI–IX. Teams perform expressive and theme-based dances to pre-recorded music that reflects rhythm, creativity, and synchronization.<br></br>
Costumes must be appropriate, and Bollywood tracks are not allowed. Props may be used, but no phones or changing rooms are provided.<br></br>
Judged on: Choreography, expression, synchronization, creativity, and presentation.<br></br>
<a href="https://forms.gle/Y7SmWZ4zfLD2hhvP9" target="_blank">Click here to register</a>`
  },
  {
    name: "Nukkad Natak",
    description: `A Hindi street play competition for classes IV–V on the theme ‘एक सामंजस्यपूर्ण राष्ट्र’ (A Harmonious Nation). Students dramatize social issues promoting unity and national values.<br></br>
Teams must bring their own props. Use of fire or water on stage is strictly prohibited, and adult assistance is not allowed.<br></br>
Judged on: Dialogue delivery, expressions, theme relevance, and audience impact.<br></br>
<a href="https://forms.gle/vPUEhxMZUbKRRB5aA" target="_blank">Click here to register</a>`
  },
  {
    name: "Rube It Up!",
    description: `An engineering and creativity challenge for classes IX–XII where teams build a Rube Goldberg Machine — a chain reaction invention that performs a simple task in a complex and amusing way.<br></br>
Machines should be safe, stable, and within 1m³ size. The final task is to knock down a stack of paper cups using only mechanical reactions.<br></br>
Judged on: Creativity, complexity, engineering design, and presentation clarity.<br></br>
<a href="https://forms.gle/i2SQTMLGK39yQ3yB6" target="_blank">Click here to register</a>`
  },
  {
    name: "EcoInnovators",
    description: `A model-making event for classes VI–XI encouraging innovative solutions for sustainability. Teams create working models based on the theme “Innovation for a Greener and Sustainable Future”.<br></br>
Only biodegradable or recycled materials are allowed. Teams present their models within 5 minutes.<br></br>
Judged on: Creativity, scientific principle, practicality, and sustainability impact.<br></br>
<a href="https://forms.gle/VkHbceZZrPw3nz5q9" target="_blank">Click here to register</a>`
  },
  {
    name: "Reel Harmony",
    description: `A multimedia storytelling competition for classes VII–VIII. Participants create a 3-minute animated short film on a given topic using OpenShot software.<br></br>
Each team narrates their story live and synchronizes it with visuals, background music, and subtitles.<br></br>
Judged on: Creativity, technical execution, storytelling, and theme connection.<br></br>
<a href="https://forms.gle/Do2iPgwhqJRdQ8pE7" target="_blank">Click here to register</a>`
  },
  {
    name: "GameSpark",
    description: `A digital game design competition for classes IX–XII based on the theme “Duality – Two opposite forces coexist, and you must balance them”.<br></br>
Participants use Unity or Unreal Engine and present their game live to the judges. Games must be original and credited properly.<br></br>
Judged on: Originality, gameplay mechanics, creativity, and user experience.<br></br>
<a href="https://forms.gle/gxL3kqXmxEjCANtU7" target="_blank">Click here to register</a>`
  },
  {
    name: "Vista View",
    description: `A sustainability-driven art event for classes IX–XII. Teams design a 3D wall installation using waste materials under the theme “Waste to Art for Sustainable Creation”.<br></br>
Encourages upcycling and artistic innovation.<br></br>
Judged on: Creativity, originality, and thematic relevance.<br></br>
<a href="https://forms.gle/uR55HQSbNumMRY526" target="_blank">Click here to register</a>`
  },
  {
    name: "Top Coders",
    description: `A programming contest for classes IX–XII testing problem-solving, logic, and coding efficiency in Python 3.13.<br></br>
Teams solve multiple coding challenges within 1 hour using only the software provided by the school.<br></br>
Judged on: Accuracy, efficiency, creativity in solutions, and clean code structure.<br></br>
<a href="https://forms.gle/5gr6zsz6gBUeqrEH9" target="_blank">Click here to register</a>`
  },
  {
    name: "IQrypt",
    description: `A science and technology quiz for classes IX–XII. Teams compete through written prelims and live finals covering topics from science, innovation, and current technology.<br></br>
Finalists face multiple rounds of diverse, fast-paced questions on emerging scientific trends.<br></br>
Judged on: Knowledge depth, teamwork, and quick thinking.<br></br>
<a href="https://forms.gle/Nbkx2jvWz8RuqHd18" target="_blank">Click here to register</a>`
  },
  {
    name: "Bid Blitz",
    description: `A commerce and strategy event for classes X–XII modeled after an auction game. Teams use virtual funds to bid for players strategically to build the best team lineup.<br></br>
Critical thinking, finance sense, and teamwork play key roles in success.<br></br>
Judged on: Auction strategy, budget balance, and final team composition.<br></br>
<a href="https://forms.gle/81U3stCbeXUuzJpz6" target="_blank">Click here to register</a>`
  },
  {
    name: "Think Tank",
    description: `A thought-provoking group discussion event for classes IX–XII based on the Image 2025 theme “वसुधैव कुटुम्बकम्”.<br></br>
The preliminary round topic is “Bridging the Gap: Reducing Global Inequalities for a Harmonious Future”. The final topic is revealed on the spot.<br></br>
Judged on: Critical thinking, originality, relevance, communication, and confidence.<br></br>
<a href="https://forms.gle/kHXxt2XZta7qudf89" target="_blank">Click here to register</a>`
  }
];

const allevents = [...events, ...alsoevents];
