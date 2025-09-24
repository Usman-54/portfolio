// @ts-nocheck

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
});

// Hero typing effect
document.addEventListener("DOMContentLoaded", () => {
  const typedTextElement = document.getElementById("typed-text");
  if (typedTextElement) {
    const phrases = ["Web Developer", "Backend Developer", "Front-end Engineer", "Creative Coder"];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      typedTextElement.textContent = currentPhrase.substring(0, charIndex);

      if (!isDeleting && charIndex < currentPhrase.length) charIndex++;
      else if (isDeleting && charIndex > 0) charIndex--;
      else if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 1500);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(type, isDeleting ? 50 : 100);
    }
    type();
  }

  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Skill animation
  const circles = document.querySelectorAll(".skill-circle");
  circles.forEach(circle => {
    const percent = parseInt(circle.getAttribute("data-percent"));
    const fill = circle.querySelector(".skill-fill");
    const percentText = circle.querySelector(".skill-percent");
    if (!fill || !percentText) return;

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = circumference;

    // Color logic
    let color = "#27ae60";
    if (percent <= 50) color = "#e74c3c";
    // else if (percent <=60) color = "#ffc107";#f4b84d
    else if (percent <= 75) color = "#f4b84d";
    else if (percent <= 85) color = "#f1c40f";
    else if (percent <= 100) color = "#5cb85c"
    fill.style.stroke = color;

    let progress = 0;
    const interval = setInterval(() => {
      progress++;
      fill.style.strokeDashoffset = circumference - (progress / 100) * circumference;
      percentText.textContent = `${progress}%`;
      if (progress >= percent) clearInterval(interval);
    }, 20);
  });
});

// Show/hide project demo video
function showDemoVideo(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hideDemoVideo(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
