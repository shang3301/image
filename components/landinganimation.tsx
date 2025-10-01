"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(CustomEase, SplitText);

export default function LandingAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        CustomEase.create("thop", ".8, 0, .3, 1");

        const splitTextElements = (selector: string, type = "words,chars") => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const split = new SplitText(element as HTMLElement, {
              type,
              wordsClass: "word",
              charsClass: "char",
            });

            if (type.includes("chars")) {
              split.chars.forEach((char) => {
                const content = char.textContent || "";
                char.innerHTML = `<span>${content}</span>`;
              });
            }
          });
        };

        splitTextElements(".landing-intro-title h1", "words,chars");
        splitTextElements(".landing-outro-title h1", "words,chars");
        splitTextElements(".landing-tag p", "words");
        splitTextElements(".landing-card h1", "words,chars");

        const isMobile = window.innerWidth < 1000;

        gsap.set([
          ".landing-split-overlay .landing-intro-title .char span",
          ".landing-split-overlay .landing-outro-title .char span",
        ], { y: "0%" });

        gsap.set(".landing-split-overlay .landing-intro-title", {
          x: isMobile ? "0em" : "3em",
          y: isMobile ? "-2em" : "-2em",
        });

        gsap.set(".landing-split-overlay .landing-outro-title .char", {
          x: isMobile ? "0em" : "3em",
          y: isMobile ? "2em" : "2em",
        });

        const tl = gsap.timeline({ defaults: { ease: "thop" } });
        const tags = gsap.utils.toArray(".landing-tag") as HTMLElement[];

        tags.forEach((tag, index) => {
          const words = tag.querySelectorAll("p .word");
          if (words.length) {
            tl.to(words, {
              y: "0%",
              duration: 0.75,
            }, 0.5 + index * 0.1);
          }
        });

        tl.to(".landing-preloader .landing-intro-title .char span", {
          y: "0%",
          duration: 0.75,
          stagger: 0.05,
        }, 0.5)
          .to(".landing-preloader .landing-outro-title .char span", {
            y: "0%",
            duration: 0.75,
            stagger: 0.075,
          }, 2.5)
          .to(".landing-preloader .landing-intro-title", {
            x: isMobile ? "-0em" : "-3em",
            y: isMobile ? "-2em" : "-2em",
            duration: 0.75,
          }, 4.5)
          .to(".landing-preloader .landing-outro-title .char", {
            x: isMobile ? "0em" : "3em",
            y: isMobile ? "2em" : "2em",
            duration: 0.75,
            onComplete: () => {
              gsap.set(".landing-preloader", {
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              });
              gsap.set(".landing-split-overlay", {
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              });
            },
          }, 4.5)
          .to(".landing-container", {
            clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
            duration: 1,
          }, 5);

        tags.forEach((tag, index) => {
          tl.to(tag.querySelectorAll("p .word"), {
            y: "100%",
            duration: 0.75,
          }, 5.5 + index * 0.1);
        });

        tl.to([".landing-preloader", ".landing-split-overlay"], {
          y: (i) => (i === 0 ? "-50%" : "50%"),
          duration: 1,
        }, 6)
          .to(".landing-container", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          }, 6)
          .to(".landing-container .landing-card", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
          }, 6.25)
          .to(".landing-container .landing-card h1 .char span", {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
          }, 6.5);
      }, 50);
    });
  }, [mounted]);

  return null;
}
