"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import SplitType from "split-type";
import { animateTextReveal } from "@/components/gsapTextReveal";

const InfiniteGallery = () => {
  useEffect(() => {
      const items = [
  { title: "Chromatic Loopscape", description: "A vibrant cycle of color and motion." },
  { title: "Solar Bloom", description: "Sunlight bursts into radiant waves." },
  { title: "Neon Handscape", description: "Electric forms shaped by invisible hands." },
  { title: "Echo Discs", description: "Visual reverberations trapped in loops." },
  { title: "Void Gaze", description: "Peering into the endless unknown." },
  { title: "Gravity Sync", description: "Masses moving in harmonic rhythm." },
  { title: "Heat Core", description: "The fiery heart of artificial life." },
  { title: "Fractal Mirage", description: "Illusions inside fractal infinities." },
  { title: "Nova Pulse", description: "Bursts of energy from the future." },
  { title: "Sonic Horizon", description: "Where sound and sight collide." },
  { title: "Dream Circuit", description: "Wires weaving dreams and memory." },
  { title: "Lunar Mesh", description: "A net of light across the moon." },
  { title: "Radiant Dusk", description: "The day’s last glow, forever looping." },
  { title: "Pixel Drift", description: "Bits and bytes in graceful motion." },
  { title: "Vortex Bloom", description: "Petals spiraling into digital whirlpools." },
  { title: "Shadow Static", description: "Darkness humming with static echoes." },
  { title: "Crimson Phase", description: "Shifting into a red dimension." },
  { title: "Retro Cascade", description: "A fall of glowing nostalgia." },
  { title: "Photon Fold", description: "Light twisted into shape and form." },
  { title: "Zenith Flow", description: "Reaching the peak of fluid design." }
];

    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const container = document.querySelector(".gallery-container");
    const canvas = document.querySelector(".gallery-canvas");
    const overlay = document.querySelector(".gallery-overlay");
    const projectTitleElement = document.querySelector(".gallery-project-title p");

    const itemCount = 18;
    const itemGap = 100;
    const columns = 4;
    const itemWidth = 120;
    const itemHeight = 160;

    let isDragging = false;
    let startX, startY;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let dragVelocityX = 0, dragVelocityY = 0;
    let lastDragTime = 0;
    let mouseHasMoved = false;
    let visibleItems = new Set();
    let lastUpdateTime = 0;
    let lastX = 0, lastY = 0;
    let isExpanded = false;
    let activeItem = null;
    let canDrag = true;
    let originalPosition = null;
    let expandedItem = null;
    let activeItemId = null;
    let titleSplit = null;

    function setAndAnimateTitle(title) {
      if (titleSplit) titleSplit.revert();
      projectTitleElement.textContent = title;
      titleSplit = new SplitType(projectTitleElement, { types: "words" });
      gsap.set(titleSplit.words, { y: "100%" });
    }

    function animateTitleIn() {
      gsap.to(titleSplit.words, {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }

    function animateTitleOut() {
      gsap.to(titleSplit.words, {
        y: "-100%",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }

    function updateVisibleItems() {
      const buffer = 2.5;
      const viewWidth = window.innerWidth * (1 + buffer);
      const viewHeight = window.innerHeight * (1 + buffer);
      const movingRight = targetX > currentX;
      const movingDown = targetY > currentY;
      const directionBufferX = movingRight ? -300 : 300;
      const directionBufferY = movingDown ? -300 : 300;

      const startCol = Math.floor((-currentX + (movingRight ? directionBufferX : 0)) / (itemWidth + itemGap));
      const endCol = Math.ceil((-currentX + viewWidth * 1.5 + (!movingRight ? directionBufferX : 0)) / (itemWidth + itemGap));
      const startRow = Math.floor((-currentY + (movingDown ? directionBufferY : 0)) / (itemHeight + itemGap));
      const endRow = Math.ceil((-currentY + viewHeight * 1.5 + (!movingDown ? directionBufferY : 0)) / (itemHeight + itemGap));

      const currentItems = new Set();

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const itemId = `${col},${row}`;
          currentItems.add(itemId);
          if (visibleItems.has(itemId)) continue;
          if (activeItemId === itemId && isExpanded) continue;

          const item = document.createElement("div");
          item.className = "gallery-item";
          item.id = itemId;
          item.style.left = `${col * (itemWidth + itemGap)}px`;
          item.style.top = `${row * (itemHeight + itemGap)}px`;
          item.dataset.col = col;
          item.dataset.row = row;

          const itemNum = (Math.abs(row * columns + col) % itemCount) + 1;
          const img = document.createElement("img");
          img.src = `images/gallery/${itemNum}.jpg`;
          img.alt = `Image ${itemNum}`;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          item.appendChild(img);

          item.addEventListener("click", () => {
            if (mouseHasMoved || isDragging) return;
            handleItemClick(item);
          });

          canvas.appendChild(item);
          visibleItems.add(itemId);
        }
      }

      visibleItems.forEach((itemId) => {
        if (!currentItems.has(itemId) || (activeItemId === itemId && isExpanded)) {
          const item = document.getElementById(itemId);
          if (item) canvas.removeChild(item);
          visibleItems.delete(itemId);
        }
      });
    }

    function handleItemClick(item) {
      if (isExpanded) {
        if (expandedItem) closeExpandedItem();
      } else {
        expandItem(item);
      }
    }

function getCanvasOffset() {
  const transform = canvas.style.transform;
  const match = /translate\((-?\d+(?:\.\d+)?)(?:px)?,\s*(-?\d+(?:\.\d+)?)(?:px)?\)/.exec(transform);
  if (!match) return { x: 0, y: 0 };
  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2])
  };
}

function getOffsetRelativeToPage(el) {
  const rect = el.getBoundingClientRect();
  const canvasTransform = canvas.style.transform;
  const match = /translate\((-?\d+(\.\d+)?)(px)?,\s*(-?\d+(\.\d+)?)(px)?\)/.exec(canvasTransform);
  const offsetX = match ? parseFloat(match[1]) : 0;
  const offsetY = match ? parseFloat(match[4]) : 0;

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    canvasOffsetX: offsetX,
    canvasOffsetY: offsetY
  };
}


function expandItem(item) {
  isExpanded = true;
  activeItem = item;
  activeItemId = item.id;
  canDrag = false;
  container.style.cursor = "auto";

  const imgElement = item.querySelector("img");
  const imgSrc = imgElement.src;
  const imgMatch = imgSrc.match(/(\d+)\.jpg$/);
  const imgNum = imgMatch ? parseInt(imgMatch[1]) : 1;
  const itemData = items[(imgNum - 1) % items.length];

  setAndAnimateTitle(itemData.title);
  item.style.visibility = "hidden";

  const rect = getOffsetRelativeToPage(imgElement);

  originalPosition = {
    id: item.id,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    },
    canvasOffsetX: rect.canvasOffsetX,
    canvasOffsetY: rect.canvasOffsetY,
    imgSrc
  };

  overlay.classList.add("gallery-overlay-active");

  expandedItem = document.createElement("div");
  expandedItem.className = "expanded-item";
  expandedItem.style.position = "fixed";
  expandedItem.style.top = `${rect.top}px`;
  expandedItem.style.left = `${rect.left}px`;
  expandedItem.style.width = `${rect.width}px`;
  expandedItem.style.height = `${rect.height}px`;
  expandedItem.style.zIndex = "9999";
  expandedItem.style.overflow = "hidden";

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = itemData.title;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";

  const caption = document.createElement("div");
  caption.className = "expanded-caption";

    if (caption) {
      gsap.to(caption, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "power1.inOut"
      });
    }
    if (caption) {
      caption.style.opacity = "0";
      caption.style.pointergallery = "none";
      caption.style.position = "absolute"; // Take it out of the flow
    }

  const titleEl = document.createElement("h2");
  titleEl.textContent = itemData.title;

  const para = document.createElement("p");
  para.textContent = itemData.description;

  caption.appendChild(titleEl);
  caption.appendChild(para);

  expandedItem.appendChild(img);
  expandedItem.appendChild(caption);

  expandedItem.addEventListener("click", closeExpandedItem);
  document.body.appendChild(expandedItem);

  const targetWidth = window.innerWidth * 0.7;
  const targetHeight = targetWidth * 1.7;
  const targetX = (window.innerWidth - targetWidth) / 2;
  const targetY = (window.innerHeight - targetHeight) / 2;

    gsap.to(expandedItem, {
    top: targetY,
    left: targetX,
    width: targetWidth,
    height: targetHeight,
    duration: 1,
    ease: "hop",
    onStart: () => {
      gsap.delayedCall(0.5, animateTitleIn);
    },
    onComplete: () => {
      if (caption) {
        caption.style.opacity = "1";
        caption.style.pointergallery = "auto";

        requestAnimationFrame(() => {
          animateTextReveal(".expanded-item .expanded-caption h2", 0.1);
          animateTextReveal(".expanded-item .expanded-caption p", 0.2);
        });
      }
    }
  });


  document.querySelectorAll(".gallery-item").forEach((el) => {
    if (el !== item) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        pointergallery: "none"
      });
    }
  });
}


function closeExpandedItem() {
  if (!expandedItem || !originalPosition) return;

  animateTitleOut();
  overlay.classList.remove("gallery-overlay-active");

  const originalItem = document.getElementById(activeItemId);
  if (!originalItem) {
    console.warn("Original item not found.");
    return;
  }

  const imgElement = originalItem.querySelector("img");
  const rect = getOffsetRelativeToPage(imgElement);

  const caption = expandedItem.querySelector(".expanded-caption");

    if (caption) {
      gsap.to(caption, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "power1.inOut"
      });
    }
    if (caption) {
      caption.style.opacity = "0";
      caption.style.pointergallery = "none";
      caption.style.position = "absolute"; // Take it out of the flow
    }



  gsap.to(expandedItem, {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    duration: 1,
    ease: "hop",
    onComplete: () => {
      if (expandedItem?.parentNode) document.body.removeChild(expandedItem);
      if (originalItem) originalItem.style.visibility = "visible";
      expandedItem = null;
      isExpanded = false;
      activeItem = null;
      originalPosition = null;
      activeItemId = null;
      canDrag = true;
      container.style.cursor = "grab";
      dragVelocityX = 0;
      dragVelocityY = 0;
    }
  });

  document.querySelectorAll(".gallery-item").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      pointergallery: "auto"
    });
  });
}


    function animate() {
      if (canDrag) {
        const ease = 0.075;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;

        const now = Date.now();
        const distMoved = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
        if (distMoved > 100 || now - lastUpdateTime > 120) {
          updateVisibleItems();
          lastX = currentX;
          lastY = currentY;
          lastUpdateTime = now;
        }
      }
      requestAnimationFrame(animate);
    }

    container.addEventListener("mousedown", (e) => {
      if (!canDrag) return;
      isDragging = true;
      mouseHasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      container.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging || !canDrag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) mouseHasMoved = true;

      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime);
      lastDragTime = now;
      dragVelocityX = dx / dt;
      dragVelocityY = dy / dt;
      targetX += dx;
      targetY += dy;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      if (canDrag) {
        container.style.cursor = "grab";
        if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
          const momentumFactor = 200;
          targetX += dragVelocityX * momentumFactor;
          targetY += dragVelocityY * momentumFactor;
        }
      }
    });

    overlay.addEventListener("click", () => {
      if (isExpanded) closeExpandedItem();
    });

    container.addEventListener("touchstart", (e) => {
      if (!canDrag) return;
      isDragging = true;
      mouseHasMoved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || !canDrag) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) mouseHasMoved = true;
      targetX += dx;
      targetY += dy;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });

    window.addEventListener("resize", () => {
      if (isExpanded && expandedItem) {
        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * 0.4;
        const targetHeight = targetWidth * 1.4;
        gsap.to(expandedItem, {
          width: targetWidth,
          height: targetHeight,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        updateVisibleItems();
      }
    });

    updateVisibleItems();
    animate();
  }, []);

  return (
  <div className="gallery-container">
    <div className="gallery-canvas"></div>
    <div className="gallery-overlay"></div>
    <div className="gallery-project-title">
      <p></p>
    </div>
  </div>
);

};

export default InfiniteGallery;
