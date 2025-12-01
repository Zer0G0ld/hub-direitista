// ===============================================
// BANCO DE DADOS DO HUB — simples, limpo e expansível
// ===============================================
const hubData = {
  producao: [
    {
      name: "Zer0",
      img: "./public/icons/default.jpg",
      links: {
        Substack: "https://substack.com/@zer0g0ld"
      }
    },
    {
      name: "Staan",
      img: "./public/icons/default.jpg",
      links: {
        Substack: "https://seu-substack.com/staan"
      }
    },
    {
      name: "Montoya",
      img: "./public/icons/default.jpg",
      links: {
        Substack: "https://seu-substack.com/montoya"
      }
    }
  ],

  portavoze: [
    {
      name: "Midia BH",
      img: "./public/icons/tech.jpg",
      links: {
        YouTube: "https://youtube.com",
        Kick: "https://kick.com"
      }
    },
    {
      name: "Brasão",
      img: "./public/icons/tech.jpg",
      links: {
        YouTube: "https://youtube.com"
      }
    },
    {
      name: "IMPERA",
      img: "./public/icons/tech.jpg",
      links: {
        YouTube: "https://youtube.com",
        Kick: "https://kick.com"
      }
    }
  ],

  plataformas: [
    {
      name: "Aristocracia",
      img: "./public/icons/tenee.jpg",
      links: {
        Discord: "https://discord.gg/seuconvite"
      }
    },
    {
      name: "Pardistão",
      img: "./public/icons/tenee.jpg",
      links: {
        Discord: "https://discord.gg/seuconvite"
      }
    },
    {
      name: "Missão",
      img: "./public/icons/tenee.jpg",
      links: {
        Discord: "https://discord.gg/seuconvite"
      }
    }
  ]
};

// ===============================================
// GERADOR DE HTML AUTOMÁTICO (mini e full)
// ===============================================

const createPersonHTML = (person) => `
  <div class="person hidden">
    <img src="${person.img}" alt="${person.name}">
    <span>${person.name}</span>
  </div>
`;

const createFullPersonHTML = (person) => {
  const linksHTML = Object.entries(person.links)
    .map(([label, url]) => `<a href="${url}" class="link-btn" target="_blank">${label}</a>`)
    .join("");

  return `
    <div class="full-person hidden">
      <img src="${person.img}" alt="${person.name}">
      <div class="fp-info">
        <strong>${person.name}</strong>
        <div class="fp-links">${linksHTML}</div>
      </div>
    </div>
  `;
};

function renderSection(list, targetMini, targetFull) {
  const mini = document.querySelector(targetMini);
  const full = document.querySelector(targetFull);

  list.forEach(person => {
    mini.innerHTML += createPersonHTML(person);
    full.innerHTML += createFullPersonHTML(person);
  });
}

// Renderização automática
renderSection(hubData.producao, "#mini-producao", "#lista-producao");
renderSection(hubData.portavoze, "#mini-portavoze", "#lista-portavoze");
renderSection(hubData.plataformas, "#mini-plataformas", "#lista-plataformas");

// ===============================
// ESTILOS E ANIMAÇÕES
// ===============================

// Cria apenas UM bloco de estilos
const dynamicStyle = document.createElement("style");
document.head.appendChild(dynamicStyle);

dynamicStyle.innerHTML = `
.hidden {
  opacity: 0;
  transform: translateY(20px);
  transition: .8s ease-out;
}

.show {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

html {
  scroll-behavior: smooth;
}

body {
  overscroll-behavior: contain;
}
`;

// ===========================================
// Fade-in ao aparecer na tela (scroll reveal)
// ===========================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Observa tudo que deve animar
setTimeout(() => {
  document.querySelectorAll(".hidden").forEach(el => observer.observe(el));
}, 100);

// ===============================
// Scroll suave para âncoras
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
// Microanimação nos botões (efeito clique elegante)
// ====================================================

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("btn")) {
    e.target.style.transform = "scale(0.95)";
  }
});

document.addEventListener("mouseup", (e) => {
  if (e.target.classList.contains("btn")) {
    e.target.style.transform = "scale(1)";
  }
});
