const languageButton = document.querySelector("#language");
const viewer = document.querySelector("#viewer");
const photos = [...document.querySelectorAll(".zoom")];
const large = document.querySelector("#large");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let language = "en";
let currentPhoto = 0;
let opener;
const localized = [...document.querySelectorAll("[data-zh], [data-alt-zh], [data-label-zh]")].map(element => {
  const attribute = element.hasAttribute("data-alt-zh") ? "alt" : element.hasAttribute("data-label-zh") ? "aria-label" : null;
  return { element, attribute, en: attribute ? element.getAttribute(attribute) : element.textContent,
    zh: element.dataset.altZh || element.dataset.labelZh || element.dataset.zh };
});
function setLanguage(value) {
  language = value === "zh" ? "zh" : "en";
  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  for (const item of localized) {
    if (item.attribute) item.element.setAttribute(item.attribute, item[language]);
    else item.element.textContent = item[language];
  }
  document.title = language === "zh" ? "Yuanhang Wang · 机械工程" : "Yuanhang Wang · Mechanical Engineering";
  languageButton.textContent = language === "zh" ? "EN" : "中文";
  languageButton.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换到中文");
  if (viewer.open) showPhoto(currentPhoto);
}
languageButton.hidden = false;
try { setLanguage(localStorage.getItem("portfolio-language")); } catch { setLanguage("en"); }
languageButton.addEventListener("click", () => {
  setLanguage(language === "en" ? "zh" : "en");
  try { localStorage.setItem("portfolio-language", language); } catch {}
});
function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const link = photos[currentPhoto];
  const caption = link.nextElementSibling;
  large.src = link.href;
  large.alt = link.querySelector("img").alt;
  document.querySelector("#viewer-title").textContent = caption.querySelector("h3").textContent;
  document.querySelector("#viewer-description").textContent = caption.querySelector("p").textContent;
  document.querySelector("#count").textContent = (currentPhoto + 1) + " / " + photos.length;
  if (!reducedMotion.matches && large.animate) large.animate([{opacity: .6}, {opacity: 1}], {duration: 200});
}
photos.forEach((link, index) => link.addEventListener("click", event => {
  if (!viewer.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  showPhoto(index);
  viewer.showModal();
  document.querySelector("#close").focus();
}));
document.querySelector("#close").addEventListener("click", () => viewer.close());
document.querySelector("#prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector("#next").addEventListener("click", () => showPhoto(currentPhoto + 1));
viewer.addEventListener("close", () => {
  choosePart(currentPhoto, false);
  (photos[currentPhoto] || opener)?.focus({preventScroll:true});
});
viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === "ArrowRight" ? 1 : -1));
  }
});
viewer.addEventListener("click", event => {
  if (event.target !== viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
});
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add("arrived");
      observer.unobserve(entry.target);
    }
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

const partButtons = [...document.querySelectorAll("[data-part]")];
const details = [...document.querySelectorAll("[data-detail]")];
function choosePart(index, animate = true) {
  for (const button of partButtons) button.setAttribute("aria-pressed", String(Number(button.dataset.part) === index));
  for (const detail of details) detail.hidden = Number(detail.dataset.detail) !== index;
  if (animate && !reducedMotion.matches) {
    details[index].animate?.([{opacity:.5, transform:"translateY(5px)"}, {opacity:1,transform:"none"}], {duration:240});
  }
}
for (const button of partButtons) {
  button.hidden = false;
  button.addEventListener("click", () => choosePart(Number(button.dataset.part)));
}
document.querySelector(".pickers").hidden = false;
choosePart(0, false);

const channels = [...document.querySelectorAll("[data-channel]")];
const wires = [...document.querySelectorAll(".wires i")];
const notes = [...document.querySelectorAll("[data-route-note]")];
const pulse = document.createElement("i");
pulse.className = "route-pulse";
document.querySelector(".to-pc").append(pulse);
function selectChannel(index, animate) {
  channels.forEach((button, i) => {
    button.setAttribute("aria-pressed", String(i === index));
    wires[i].classList.toggle("on", i === index);
    notes[i].hidden = i !== index;
  });
  if (animate && !reducedMotion.matches && pulse.animate) {
    pulse.getAnimations().forEach(animation => animation.cancel());
    pulse.animate([{left:"0%",opacity:0},{offset:.18,opacity:1},{offset:.82,opacity:1},{left:"95%",opacity:0}], {duration:570});
  }
}
channels.forEach((button, i) => button.addEventListener("click", () => selectChannel(i, true)));
selectChannel(0, false);
