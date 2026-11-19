const body = document.body;
const root = document.documentElement;
const themeButton = document.getElementById("themeButton");
const printButton = document.getElementById("printButton");
const progress = document.getElementById("scrollProgress");
const topbar = document.querySelector(".topbar");
const mainNav = document.querySelector(".nav");
const langButtons = [...document.querySelectorAll("[data-set-lang]")];

const metadata = {
  ru: {
    title: "Артём Чернушевич — продакт‑лидер в e‑commerce",
    description: "Продакт‑лидер в e‑commerce: нахожу, где бизнес теряет деньги и время, делаю продукт, который это закрывает, и довожу до цифры в отчёте."
  },
  en: {
    title: "Artyom Chernushevich — product leader in e‑commerce",
    description: "Product leader in e‑commerce: I find where a business loses money and time, build the product that fixes it and push it to a number in the report."
  }
};

function setLanguage(language) {
  const lang = language === "en" ? "en" : "ru";
  body.dataset.lang = lang;
  root.lang = lang;
  document.title = metadata[lang].title;
  document.querySelector('meta[name="description"]').content = metadata[lang].description;
  mainNav?.setAttribute("aria-label", lang === "ru" ? "Основная навигация" : "Main navigation");
  themeButton?.setAttribute("aria-label", lang === "ru" ? "Переключить тему" : "Toggle theme");
  langButtons.forEach((button) => {
    const isActive = button.dataset.setLang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  localStorage.setItem("resume-language", lang);
}

function setTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  body.dataset.theme = nextTheme;
  root.dataset.theme = nextTheme;
  localStorage.setItem("resume-theme", nextTheme);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.setLang));
});

themeButton?.addEventListener("click", () => {
  setTheme(body.dataset.theme === "dark" ? "light" : "dark");
});

printButton?.addEventListener("click", () => window.print());

const savedLanguage = localStorage.getItem("resume-language");
const savedTheme = localStorage.getItem("resume-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
setLanguage(savedLanguage || "ru");
setTheme(savedTheme || preferredTheme);

function updateScrollUI() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  topbar.classList.toggle("is-scrolled", scrollTop > 12);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

const revealItems = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
