// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize card layout for mobile
  initResponsiveLayout();

  // Initialize draggable papers
  initDraggable();

  // Initialize tilt effect on cards (disable on mobile)
  initTilt();

  // Add tap/double-tap heart creation
  initHeartCreation();

  // Initialize music controls
  initMusic();

  // Add special effect to red card
  initConfettiBurst();

  // Handle orientation changes
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
});

// Adjust layout for different screen sizes
function initResponsiveLayout() {
  const container = document.querySelector(".container");
  const papers = document.querySelectorAll(".paper");
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Arrange cards in a scrollable layout for mobile
    container.style.overflowY = "auto";
    container.style.overflowX = "hidden";
    container.style.height = "auto";
    container.style.minHeight = "100vh";
    container.style.padding = "20px";

    // Position heart banner at the top
    const heartBanner = document.querySelector(".heart-banner");
    heartBanner.style.position = "relative";
    heartBanner.style.left = "0";
    heartBanner.style.transform = "none";
    heartBanner.style.margin = "20px auto";
    heartBanner.style.width = "90%";
    heartBanner.style.maxWidth = "350px";

    // Position other cards in a column layout
    papers.forEach((paper, index) => {
      if (!paper.classList.contains("heart-banner")) {
        paper.style.position = "relative";
        paper.style.left = "0";
        paper.style.top = "0";
        paper.style.margin = "20px auto";
        paper.style.width = "90%";
        paper.style.maxWidth = "280px";
        paper.style.transform = "none";
      }
    });

    // Position instruction card at the bottom
    const instructionCard = document.querySelector(".instruction-card");
    instructionCard.style.position = "relative";
    instructionCard.style.bottom = "0";
    instructionCard.style.right = "0";
    instructionCard.style.margin = "20px auto";

    // Update instruction text for mobile
    const instructionTexts =
      instructionCard.querySelectorAll(".instruction-text");
    instructionTexts[0].textContent = "Tap and hold cards to move them!";
    instructionTexts[1].textContent = "Double-tap to add hearts!";
  }
}

// Handle resize and orientation changes
function handleResize() {
  // Reapply responsive layout
  initResponsiveLayout();

  // Reinitialize tilt for current device
  initTilt();
}

// Make papers draggable
function initDraggable() {
  const papers = document.querySelectorAll(".paper");
  const isMobile = window.innerWidth < 768;

  papers.forEach((paper) => {
    // Don't make instruction card draggable
    if (paper.classList.contains("instruction-card")) return;

    // Skip draggable in column layout mode
    if (isMobile && paper.style.position === "relative") return;

    let isDragging = false;
    let offsetX, offsetY;

    // Add touch events
    paper.addEventListener("mousedown", startDrag);
    paper.addEventListener("touchstart", startDragTouch, { passive: false });

    function startDrag(e) {
      if (e.target.closest("a, button, .music-control")) return;

      isDragging = true;
      paper.classList.add("dragging");

      // Calculate offset from mouse position to element corner
      const rect = paper.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Add move and release listeners to document
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDrag);
    }

    function startDragTouch(e) {
      if (e.target.closest("a, button, .music-control")) return;

      isDragging = true;
      paper.classList.add("dragging");

      // Calculate offset from touch position to element corner
      const rect = paper.getBoundingClientRect();
      const touch = e.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      // Add move and release listeners to document
      document.addEventListener("touchmove", dragTouch, { passive: false });
      document.addEventListener("touchend", stopDrag);

      // Prevent scrolling while dragging
      e.preventDefault();
    }

    function drag(e) {
      if (!isDragging) return;

      // Calculate new position
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // Set new position
      paper.style.position = "absolute";
      paper.style.left = `${x}px`;
      paper.style.top = `${y}px`;
      paper.style.transform = "";
      paper.style.margin = "0";
    }

    function dragTouch(e) {
      if (!isDragging) return;

      const touch = e.touches[0];

      // Calculate new position
      const x = touch.clientX - offsetX;
      const y = touch.clientY - offsetY;

      // Set new position
      paper.style.position = "absolute";
      paper.style.left = `${x}px`;
      paper.style.top = `${y}px`;
      paper.style.transform = "";
      paper.style.margin = "0";

      // Prevent scrolling while dragging
      e.preventDefault();
    }

    function stopDrag() {
      isDragging = false;
      paper.classList.remove("dragging");

      // Remove document listeners
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", dragTouch);
      document.removeEventListener("touchend", stopDrag);
    }
  });
}

// Initialize tilt effect on cards (disable on mobile)
function initTilt() {
  // Remove existing tilt
  const tiltElements = document.querySelectorAll("[data-tilt]");
  tiltElements.forEach((element) => {
    if (element.vanillaTilt) {
      element.vanillaTilt.destroy();
    }
  });

  // Only add tilt on larger screens
  if (window.innerWidth >= 768) {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      scale: 1.03,
    });
  }
}

// Create hearts on double-click/double-tap
function initHeartCreation() {
  // Track clicks/taps for double-tap detection
  let lastTap = 0;
  const tapDelay = 300; // milliseconds

  // Function to create heart at position
  function createHeart(x, y) {
    // Create heart element
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = "❤️";
    heart.style.position = "fixed"; // Use fixed to prevent scroll issues
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.zIndex = "1005";
    heart.style.pointerEvents = "none";
    heart.style.opacity = "0.9";

    // Set animation
    heart.style.animation = `float ${
      Math.random() * 2 + 3
    }s ease-in-out forwards`;

    // Add random rotation
    const rotation = Math.random() * 40 - 20;
    heart.style.transform = `rotate(${rotation}deg)`;

    // Add to body
    document.body.appendChild(heart);

    // Remove after animation completes
    setTimeout(() => {
      heart.style.opacity = "0";
      heart.style.transition = "opacity 1s ease";

      // Remove from DOM after transition
      setTimeout(() => {
        document.body.removeChild(heart);
      }, 1000);
    }, 3000);
  }

  // Handle double-click
  document.addEventListener("dblclick", function (e) {
    createHeart(e.clientX, e.clientY);
  });

  // Handle double-tap for mobile
  document.addEventListener("touchend", function (e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < tapDelay && tapLength > 0) {
      // Double tap detected
      const touch = e.changedTouches[0];
      createHeart(touch.clientX, touch.clientY);
      e.preventDefault();
    }

    lastTap = currentTime;
  });

  // Add float animation
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.9;
      }
      50% {
        opacity: 0.9;
      }
      100% {
        transform: translateY(-100px) rotate(20deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize music controls
function initMusic() {
  const musicControl = document.querySelector(".music-control");
  const musicStatus = document.querySelector(".music-status");
  const bgMusic = document.getElementById("bgMusic");

  // Make music control more visible on mobile
  if (window.innerWidth < 768) {
    musicControl.style.padding = "12px 20px";
    musicControl.style.borderRadius = "40px";
  }

  musicControl.addEventListener("click", toggleMusic);

  function toggleMusic() {
    if (bgMusic.paused) {
      // Play music
      bgMusic
        .play()
        .then(() => {
          musicStatus.textContent = "Pause Music";
          musicControl.classList.add("music-playing");
        })
        .catch((error) => {
          console.error("Error playing music:", error);
          alert("To hear the music, please interact with the page first.");
        });
    } else {
      // Pause music
      bgMusic.pause();
      musicStatus.textContent = "Play Music";
      musicControl.classList.remove("music-playing");
    }
  }
}

// Initialize confetti burst on red card click
function initConfettiBurst() {
  const redCard = document.querySelector(".red-card");

  redCard.addEventListener("click", function (e) {
    // Don't trigger confetti if dragging
    if (this.classList.contains("dragging")) return;

    // Create confetti burst
    createConfetti(60); // Reduced number for mobile

    // Add special animation to the card
    this.style.animation = "pulse 0.5s ease-in-out";

    // Reset animation after it completes
    setTimeout(() => {
      this.style.animation = "";
    }, 500);
  });

  function createConfetti(count) {
    const confettiBurst = document.querySelector(".confetti-burst");
    confettiBurst.innerHTML = "";

    const colors = [
      "#FF69B4",
      "#FFB6C1",
      "#FFC0CB",
      "#FF1493",
      "#DB7093",
      "#C71585",
      "#DA70D6",
      "#FF00FF",
    ];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");

      // Randomize confetti appearance
      const size = Math.random() * 8 + 4; // Slightly smaller for mobile
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;

      confetti.style.position = "absolute";
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = isCircle ? "50%" : "0";

      // Randomize confetti position
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;

      // Randomize confetti animation
      const duration = Math.random() * 2 + 1;
      const delay = Math.random() * 0.5;

      confetti.style.animation = `confettiDrop ${duration}s ease-in ${delay}s forwards`;

      // Add to confetti container
      confettiBurst.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, (duration + delay) * 1000);
    }
  }

  // Add confetti animation to document
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes confettiDrop {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      80% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(${window.innerHeight}px) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
