// ===============================
// 1. Animação de entrada suave
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".header, .intro, .grid, .full-section");

  fadeElements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 200 + i * 200);
  });
});

// Adiciona estilo inicial via JS (para não piscar)
document.querySelectorAll(".header, .intro, .grid, .full-section").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
  el.style.transition = "1s ease";
});

// ===========================================
// 2. Fade-in ao aparecer na tela (scroll reveal)
// ===========================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".col, .person, .full-section").forEach(el => {
  el.classList.add("hidden");
  observer.observe(el);
});

// Classes CSS criadas via JS:
const style = document.createElement("style");
style.innerHTML = `
.hidden {
  opacity: 0;
  transform: translateY(20px);
  transition: .8s ease;
}

.show {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
`;
document.head.appendChild(style);

// ===============================
// 3. Scroll suave para âncoras
// ===============================

document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop - 20,
      behavior: "smooth"
    });
  });
});

// ====================================================
// 4. Microanimação nos botões (efeito clique elegante)
// ====================================================

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(0.95)";
  });

  btn.addEventListener("mouseup", () => {
    btn.style.transform = "scale(1)";
  });
});

// ====================================================
// 5. Suavização geral de scroll (inércia leve)
// ====================================================

style.innerHTML += `
html {
  scroll-behavior: smooth;
}

body {
  overscroll-behavior: contain;
}
`;
document.head.appendChild(style);
