// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize draggable papers
  initDraggable();

  // Initialize tilt effect on cards
  initTilt();

  // Add double-click heart creation
  initHeartCreation();

  // Initialize music controls
  initMusic();

  // Add special effect to red card
  initConfettiBurst();
});

// Make papers draggable
function initDraggable() {
  const papers = document.querySelectorAll(".paper");

  papers.forEach((paper) => {
    // Don't make instruction card draggable
    if (paper.classList.contains("instruction-card")) return;

    let isDragging = false;
    let offsetX, offsetY;

    paper.addEventListener("mousedown", startDrag);
    paper.addEventListener("touchstart", startDragTouch);

    function startDrag(e) {
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
      isDragging = true;
      paper.classList.add("dragging");

      // Calculate offset from touch position to element corner
      const rect = paper.getBoundingClientRect();
      const touch = e.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      // Add move and release listeners to document
      document.addEventListener("touchmove", dragTouch);
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
      paper.style.left = `${x}px`;
      paper.style.top = `${y}px`;

      // Remove transforms that might interfere with dragging
      paper.style.transform = "";
    }

    function dragTouch(e) {
      if (!isDragging) return;

      const touch = e.touches[0];

      // Calculate new position
      const x = touch.clientX - offsetX;
      const y = touch.clientY - offsetY;

      // Set new position
      paper.style.left = `${x}px`;
      paper.style.top = `${y}px`;

      // Remove transforms that might interfere with dragging
      paper.style.transform = "";

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

// Initialize tilt effect on cards
function initTilt() {
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3,
    scale: 1.03,
  });
}

// Create hearts on double-click
function initHeartCreation() {
  document.addEventListener("dblclick", function (e) {
    // Create heart element
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    heart.style.zIndex = "5";
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
  });
}

// Initialize music controls
function initMusic() {
  const musicControl = document.querySelector(".music-control");
  const musicStatus = document.querySelector(".music-status");
  const bgMusic = document.getElementById("bgMusic");

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

  redCard.addEventListener("click", function () {
    // Create confetti burst
    createConfetti(100);

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
      const size = Math.random() * 10 + 5;
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
