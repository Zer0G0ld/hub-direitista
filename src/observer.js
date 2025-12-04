// src/observer.js
export const createObserver = () => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });
};
