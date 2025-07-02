// components/gsapTextReveal.ts
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export function animateTextReveal(selector: string, delay = 0) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el, index) => {
    const split = new SplitText(el as HTMLElement, {
      type: "words,chars",
      wordsClass: "word",
      charsClass: "char",
    });

    gsap.set(split.chars, { y: "100%" });

    gsap.to(split.chars, {
      y: "0%",
      duration: 0.75,
      stagger: 0.05,
      delay: delay + index * 0.1,
      ease: "power2.out",
    });
  });
}
