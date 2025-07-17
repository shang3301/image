"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { animateTextReveal } from "@/components/gsapTextReveal";

export default function Team() {
  useEffect(() => {
    requestAnimationFrame(() => {
    const galleryContainer = document.querySelector(".team");
    const imgModal = document.querySelector(".img-modal");
    const imgViewContainer = imgModal?.querySelector(".img");
    const modalName = imgModal?.querySelector(".img-name p");

    if (!galleryContainer || !imgModal || !imgViewContainer || !modalName) return;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

    function generateRandomName() {
      const nameLength = Math.floor(Math.random() * 3) + 3;
      let randomName = "";
      for (let i = 0; i < nameLength; i++) {
        randomName += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return randomName + ".jpg";
    }
    
    const tl = gsap.timeline({ paused: true }).reverse();

function revealModal() {
  tl.to(".img-modal", {
    duration: 0.3,
    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "power2.inOut",
    pointerEvents: "auto",
  });

  tl.to(".img-modal .img", {
    duration: 0.3,
    clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "power2.inOut",
  }, "<");

  tl.fromTo(".img-modal .img img", {
    x: 30,
    opacity: 0,
    scale: 0.95,
  }, {
    x: 0,
    opacity: 1,
    scale: 1,
    duration: 0.25,
    ease: "power1.out"
  }, "<+0.1");

  tl.to(".modal-item p", {
    duration: 0.3,
    top: 0,
    ease: "power2.inOut",
    stagger: { amount: 0.1 },
  }, "+=0.1");
}


    // Create gallery items
    const totalImages = 20;
    const totalItems = 40;

    for (let i = 0; i < totalItems; i++) {
      const imageIndex = (i % totalImages) + 1;
      const imageName = `${imageIndex}.jpg`;

      const item = document.createElement("div");
      item.classList.add("item");

      const itemImg = document.createElement("div");
      itemImg.classList.add("item-img");

      const imgTag = document.createElement("img");
      imgTag.src = `/images/${imageName}`;
      imgTag.alt = imageName;

      imgTag.onerror = () => {
        item.remove(); // remove broken images
      };

      itemImg.appendChild(imgTag);

      const itemName = document.createElement("div");
      itemName.classList.add("item-name");
      const randomName = generateRandomName();
      itemName.textContent = randomName;

      item.appendChild(itemImg);
      item.appendChild(itemName);

      // Click event for item
      item.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent global click close
        const fullImg = new Image();
        fullImg.src = imgTag.src;
        fullImg.alt = randomName;
        fullImg.style.width = "100%";
        fullImg.style.height = "100%";
        fullImg.style.objectFit = "cover";
        fullImg.style.position = "absolute";
        fullImg.onload = () => {
          imgViewContainer.innerHTML = "";
          imgViewContainer.appendChild(fullImg);

          modalName.innerHTML = `<span>${randomName}</span>`; // wrap for animation
          animateTextReveal(".img-name p span", 0.2); // apply animation

          if (tl.reversed()) tl.reversed(false); // animate in if closed

        };
      });

      galleryContainer.appendChild(item);
    }

    animateTextReveal(".item-name", 0.1);

    // Click anywhere to close
    document.addEventListener("click", () => {
      if (!tl.reversed()) {
        tl.timeScale(2); // Speeds up reverse
        tl.reversed(true);
      }
    });

    revealModal();
    animateTextReveal(".item-name", 0.1);
    });
  }, []);

  return (
    <>
      <div className="container">
        <div className="team" />
      </div>

      <div className="img-modal">
        <div className="img"></div>

        <div className="modal-item img-name">
          <p>Image Name</p>
          <div className="modal-item-revealer"></div>
        </div>
      </div>
    </>
  );
}
