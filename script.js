// ===============================================
// BANCO DE DADOS DO HUB — simples, limpo e expansível
// ===============================================
const hubData = {
  producao: [
    {
      name: "Zer0",
      img: "./public/persons/zer0g0ld.png",
      links: {
        Substack: "https://substack.com/@zer0g0ld"
      }
    },
    {
      name: "Staan Marsh",
      img: "./public/persons/Staan_Marsh.png",
      links: {
        Substack: "https://substack.com/@adson02"
      }
    },
    {
      name: "Noir",
      img: "./public/persons/Noir.png",
      links: {
        Substack: "https://substack.com/@noiret"
      }
    },
    {
      name: "Arnando Leal",
      img: "./public/persons/Armando_Leal.png",
      links: {
        Substack: "https://substack.com/@historiacontraataca"
      }
    },
    {
      name: "Luciano LS",
      img: "./public/persons/Luciano_LS.png",
      links: {
        Substack: "https://substack.com/@lucianols"
      }
    },
    {
      name: "Gabriel C. Tavares",
      img: "./public/persons/Gabriel_C_Tavares.png",
      links: {
        Substack: "https://substack.com/@quietbiel93"
      }
    },
    {
      name: "Francielly Stempkowski",
      img: "./public/persons/Francielly_Stempkowski.png",
      links: {
        Substack: "https://substack.com/@stempkowski"
      }
    },
    {
      name: "Cristian Brocca",
      img: "./public/persons/Cristian_Brocca.png",
      links: {
        Substack: "https://substack.com/@cristianbrocca"
      }
    },
  ],

  portavoze: [
    {
      name: "Midia BH",
      img: "./public/porta_vozes/BrunoDiasPR.jpg",
      links: {
        YouTube: "https://www.youtube.com/@MidiaBH",
        Kick: "https://kick.com/brunodiaspr"
      }
    },
  ],

  plataformas: [
    {
      name: "Aristocracia",
      img: "./public/icons/default.jpg",
      links: {
        Discord: "https://discord.gg/XncGYt2Y7g"
      }
    },
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
