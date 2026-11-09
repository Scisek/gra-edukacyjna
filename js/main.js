import { app, closeModal, focusRoute, go, pickAnswer, setRenderer } from "./actions.js";
import { activeProfile } from "./storage.js";
import { renderApp } from "./views.js";

setRenderer(() => {
  const root = document.querySelector("#app");
  root.replaceChildren(renderApp());
  focusRoute();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && app.modal) {
    event.preventDefault();
    closeModal();
    return;
  }
  if (app.route.name !== "quiz" || app.round?.locked) return;
  if (!/^[1-4]$/.test(event.key)) return;
  const buttons = document.querySelectorAll("[data-choice]");
  const button = buttons[Number(event.key) - 1];
  if (!button) return;
  event.preventDefault();
  pickAnswer(button.dataset.choice);
});

const profile = activeProfile();
go(profile ? "home" : "profiles");
