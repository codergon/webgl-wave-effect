import One from "./demo";

const pages = [One];
const pageId = document.body.getAttribute("data-id");

new pages[pageId]();

const images = document.querySelectorAll("img");
let imagesIndex = 0;

Array.from(images).forEach(element => {
  const image = new Image();

  image.src = element.src;
  image.onload = _ => {
    imagesIndex += 1;

    if (imagesIndex === images.length) {
      document.documentElement.classList.remove("loading");
      document.documentElement.classList.add("loaded");
    }
  };
});
