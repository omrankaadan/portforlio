import { SceneController } from "./scene.js";
import { education } from "./data.js";
import { SmoothScroll } from "./smoothScroll.js";

const EMAIL = "omrankaadan4@gmail.com";

function renderEducation() {
  const root = document.getElementById("education-timeline");
  if (!root) return;
  root.innerHTML = education
    .map(
      (item) => `
      <div class="timeline-item">
        <span class="when">${item.when}</span>
        <h3>${item.degree}</h3>
        <p>${item.school}</p>
        ${item.note ? `<span class="education-note">${item.note}</span>` : ""}
      </div>`
    )
    .join("");
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupLightbox() {
  const box = document.getElementById("lightbox");
  const trigger = document.getElementById("photo-trigger");
  const close = document.getElementById("lightbox-close");
  if (!box || !trigger) return;

  const open = () => {
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
  };
  const shut = () => {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
  };

  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
  close?.addEventListener("click", shut);
  box.addEventListener("click", (e) => {
    if (e.target === box) shut();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") shut();
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const nameEl = document.getElementById("cf-name");
  const emailEl = document.getElementById("cf-email");
  const msgEl = document.getElementById("cf-message");
  const hint = document.getElementById("form-hint");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  for (const el of [nameEl, emailEl, msgEl]) {
    el.addEventListener("input", () => el.classList.remove("invalid"));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    if (!nameEl.value.trim()) {
      nameEl.classList.add("invalid");
      ok = false;
    }
    if (!emailOk(emailEl.value.trim())) {
      emailEl.classList.add("invalid");
      ok = false;
    }
    if (msgEl.value.trim().length < 5) {
      msgEl.classList.add("invalid");
      ok = false;
    }
    if (!ok) {
      hint.textContent = "Please add your name, a valid email and a message.";
      hint.classList.add("error");
      return;
    }

    const name = nameEl.value.trim();
    const subject = `Portfolio contact from ${name}`;
    const body = `${msgEl.value.trim()}\n\n— ${name} (${emailEl.value.trim()})`;
    const url =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(EMAIL)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    hint.classList.remove("error");
    hint.textContent = "Gmail opened in a new tab — press Send to deliver your message.";
    window.open(url, "_blank", "noopener");
  });
}

function hideLoader() {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 500);
}

function init() {
  renderEducation();
  setupReveal();
  setupLightbox();
  setupContactForm();

  const scroller = new SmoothScroll();
  window.__smoothScroll = scroller;

  try {
    const canvas = document.getElementById("scene");
    const controller = new SceneController(canvas, scroller);
    controller.start();
    window.__portfolioScene = controller;
  } catch (err) {
    console.error("WebGL scene failed:", err);
    document.getElementById("scene").style.display = "none";
  }

  hideLoader();
}

init();
