document.addEventListener("DOMContentLoaded", function () {
  const papers = document.querySelectorAll(".paper");

  // Add floating birthday elements in the background
  const birthdayElements = ["🎂", "🎈", "🎁", "🎊", "🎉", "💝", "✨"];
  for (let i = 0; i < 20; i++) {
    createFloatingElement(
      birthdayElements[Math.floor(Math.random() * birthdayElements.length)]
    );
  }

  function createFloatingElement(emoji) {
    const element = document.createElement("div");
    element.textContent = emoji;
    element.className = "floating-element";
    element.style.fontSize = Math.random() * 15 + 15 + "px";
    element.style.left = Math.random() * 100 + "%";
    element.style.top = Math.random() * 100 + "%";
    element.style.opacity = "0.7";
    element.style.animationDuration = Math.random() * 5 + 8 + "s";
    element.style.animationDelay = Math.random() * 5 + "s";
    document.body.appendChild(element);
  }

  // Create a birthday message that appears after a delay
  setTimeout(() => {
    createBirthdayMessage();
  }, 1000);

  function createBirthdayMessage() {
    const message = document.createElement("div");
    message.innerHTML = "Happy Birthday!";
    message.style.position = "absolute";
    message.style.top = "5%";
    message.style.left = "50%";
    message.style.transform = "translateX(-50%) scale(0)";
    message.style.fontSize = "60px";
    message.style.fontFamily = "Dancing Script, cursive";
    message.style.color = "#d6336c";
    message.style.fontWeight = "bold";
    message.style.textShadow = "2px 2px 4px rgba(0,0,0,0.2)";
    message.style.zIndex = "100";
    message.style.opacity = "0";
    message.style.transition =
      "all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.opacity = "1";
      message.style.transform = "translateX(-50%) scale(1)";
      createConfettiBurst();
    }, 100);
  }

  function createConfettiBurst() {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 8 + 6 + "px";
      confetti.style.height = Math.random() * 4 + 2 + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = "2px";
      confetti.style.top = "5%";
      confetti.style.left = "50%";
      confetti.style.zIndex = "50";
      confetti.style.pointerEvents = "none";
      confetti.style.transform = "rotate(0deg)";
      confetti.style.opacity = "1";

      // Random direction burst
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 100;
      const duration = Math.random() * 3 + 3;
      confetti.style.transition = `all ${duration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.transform = `translate(${
          Math.cos(angle) * distance
        }px, ${Math.sin(angle) * distance}px) rotate(${
          Math.random() * 360
        }deg)`;
        confetti.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, duration * 1000);
    }
  }

  papers.forEach((paper) => {
    // Random slight rotation for more natural look
    const randomRotation = Math.random() * 10 - 5;
    paper.style.transform = `rotateZ(${randomRotation}deg)`;

    // Variables for dragging
    let isDragging = false;
    let offsetX, offsetY;

    // Touch and mouse event handlers
    paper.addEventListener("mousedown", startDrag);
    paper.addEventListener("touchstart", handleTouch);

    // Double-click to add a cake emoji effect
    paper.addEventListener("dblclick", addBirthdayEffect);

    function addBirthdayEffect(e) {
      const birthdayEmoji = ["🎂", "🎁", "🎉", "🎊"][
        Math.floor(Math.random() * 4)
      ];
      const emoji = document.createElement("div");
      emoji.textContent = birthdayEmoji;
      emoji.style.position = "absolute";
      emoji.style.fontSize = "25px";
      emoji.style.left = e.clientX - 12 + "px";
      emoji.style.top = e.clientY - 12 + "px";
      emoji.style.zIndex = "1000";
      emoji.style.pointerEvents = "none";
      emoji.style.animation = "float 2s ease-out forwards";
      emoji.style.opacity = "1";
      document.body.appendChild(emoji);

      setTimeout(() => {
        document.body.removeChild(emoji);
      }, 2000);
    }

    function handleTouch(e) {
      const touch = e.touches[0];
      startDrag({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      });
    }

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;

      // Calculate offset between mouse position and paper position
      const rect = paper.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Bring to front
      papers.forEach((p) => (p.style.zIndex = "1"));
      paper.style.zIndex = "1000";

      // Add dragging class for visual feedback
      paper.classList.add("dragging");

      // Add event listeners for movement and end
      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
    }

    function handleTouchMove(e) {
      const touch = e.touches[0];
      drag({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      });
    }

    function drag(e) {
      e.preventDefault();
      if (!isDragging) return;

      // Calculate new position
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // Apply new position
      paper.style.left = `${x}px`;
      paper.style.top = `${y}px`;
    }

    function endDrag() {
      isDragging = false;
      paper.classList.remove("dragging");

      // Add a little bounce effect when dropping
      paper.style.transition = "transform 0.3s ease";
      const currentRotation =
        paper.style.rotate ||
        paper.style.transform.match(/rotateZ\(([^)]+)\)/) ||
        "0deg";
      paper.style.transform = `rotateZ(${currentRotation}) scale(1.05)`;

      setTimeout(() => {
        paper.style.transform = `rotateZ(${currentRotation}) scale(1)`;
      }, 300);

      // Remove event listeners
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchend", endDrag);

      // Reset transition after animation completes
      setTimeout(() => {
        paper.style.transition = "";
      }, 300);
    }
  });

  // Special heart animation
  const heart = document.querySelector(".paper.heart");
  if (heart) {
    setInterval(() => {
      heart.style.transform = "rotateZ(-5deg) scale(1.08)";
      setTimeout(() => {
        heart.style.transform = "rotateZ(-5deg) scale(1)";
      }, 500);
    }, 3000);
  }

  // Add birthday splash effects when clicking on special papers
  const specialPapers = document.querySelectorAll(
    ".paper.red, .paper.special, .paper.coupon"
  );
  specialPapers.forEach((paper) => {
    paper.addEventListener("click", function (e) {
      if (e.target.tagName !== "IMG") {
        // Don't trigger on image clicks
        if (paper.classList.contains("coupon")) {
          createGiftAnimation(e.clientX, e.clientY);
        } else if (paper.classList.contains("special")) {
          createStarBurst(e.clientX, e.clientY);
        } else {
          createConfettiBurst(e.clientX, e.clientY);
        }
      }
    });
  });

  function createGiftAnimation(x, y) {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const gift = document.createElement("div");
        gift.textContent = "🎁";
        gift.style.position = "absolute";
        gift.style.fontSize = Math.random() * 20 + 15 + "px";
        gift.style.left = x + "px";
        gift.style.top = y + "px";
        gift.style.zIndex = "100";
        gift.style.pointerEvents = "none";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const duration = Math.random() * 2 + 1;

        gift.style.transition = `all ${duration}s ease-out`;
        document.body.appendChild(gift);

        setTimeout(() => {
          gift.style.transform = `translate(${Math.cos(angle) * distance}px, ${
            Math.sin(angle) * distance
          }px) rotate(${Math.random() * 360}deg)`;
          gift.style.opacity = "0";
        }, 10);

        setTimeout(() => {
          document.body.removeChild(gift);
        }, duration * 1000);
      }, i * 100);
    }
  }

  function createStarBurst(x, y) {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const star = document.createElement("div");
        star.textContent = "✨";
        star.style.position = "absolute";
        star.style.fontSize = Math.random() * 15 + 10 + "px";
        star.style.left = x + "px";
        star.style.top = y + "px";
        star.style.zIndex = "100";
        star.style.pointerEvents = "none";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 2 + 1;

        star.style.transition = `all ${duration}s ease-out`;
        document.body.appendChild(star);

        setTimeout(() => {
          star.style.transform = `translate(${Math.cos(angle) * distance}px, ${
            Math.sin(angle) * distance
          }px) rotate(${Math.random() * 360}deg)`;
          star.style.opacity = "0";
        }, 10);

        setTimeout(() => {
          document.body.removeChild(star);
        }, duration * 1000);
      }, i * 50);
    }
  }

  function createConfettiBurst(x, y) {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 8 + 6 + "px";
      confetti.style.height = Math.random() * 4 + 2 + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = "2px";
      confetti.style.top = y + "px";
      confetti.style.left = x + "px";
      confetti.style.zIndex = "50";
      confetti.style.pointerEvents = "none";
      confetti.style.transform = "rotate(0deg)";
      confetti.style.opacity = "1";

      // Random direction burst
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 50;
      const duration = Math.random() * 2 + 1;
      confetti.style.transition = `all ${duration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.transform = `translate(${
          Math.cos(angle) * distance
        }px, ${Math.sin(angle) * distance}px) rotate(${
          Math.random() * 360
        }deg)`;
        confetti.style.opacity = "0";
      }, 10);

      setTimeout(() => {
        document.body.removeChild(confetti);
      }, duration * 1000);
    }
  }
});
