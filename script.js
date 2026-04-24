const whatsappNumber = "919809269292";
const storeName = "Chandigarh Furniture Mall";

function slugifyProductName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createProductUrl(product) {
  const isSharableOrigin =
    window.location.protocol === "http:" || window.location.protocol === "https:";

  if (!isSharableOrigin) {
    return "";
  }

  return new URL(`#${slugifyProductName(product.name)}`, window.location.href).href;
}

function createWhatsAppLink(product) {
  const hasPublicOrigin = window.location.protocol === "http:" || window.location.protocol === "https:";
  const imageLink = hasPublicOrigin ? new URL(product.image, window.location.href).href : "";
  const productUrl = createProductUrl(product);
  const message =
    `Hi ${storeName}, I'm interested in this product.\n\n` +
    `Product Name: ${product.name}\n` +
    `Category: ${product.category}\n` +
    `Description: ${product.description}\n` +
    `Product Image: ${imageLink || "Image can be viewed on the website product card"}\n` +
    `Product URL: ${productUrl || "Publish the website online to enable a direct product link"}\n\n` +
    "Please share the price, available sizes, and delivery details.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getProductCards() {
  return Array.from(document.querySelectorAll(".product-card")).map((card) => ({
    name: card.dataset.name,
    category: card.dataset.category,
    description: card.dataset.description,
    image: card.dataset.image,
    card
  }));
}

function setupProductCards() {
  getProductCards().forEach((product) => {
    const buyLink = product.card.querySelector(".buy-now-link");

    if (buyLink) {
      buyLink.href = createWhatsAppLink(product);
    }
  });
}

function attachGlobalLinks() {
  const generalMessage =
    "Hi Chandigarh Furniture Mall, I want to know more about your furniture collection.";
  const generalLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generalMessage)}`;

  document.getElementById("header-whatsapp").href = generalLink;
  document.getElementById("hero-whatsapp").href = generalLink;
  document.getElementById("visit-whatsapp").href = generalLink;
  document.getElementById("footer-whatsapp").href = generalLink;
}

function setupImageViewer() {
  const viewer = document.getElementById("image-viewer");
  const viewerImage = document.getElementById("viewer-image");
  const viewerTitle = document.getElementById("viewer-title");
  const viewerDescription = document.getElementById("viewer-description");
  const closeButton = document.getElementById("viewer-close");

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".viewer-trigger");

    if (trigger) {
      viewerImage.src = trigger.dataset.productImage;
      viewerImage.alt = trigger.dataset.productName;
      viewerTitle.textContent = trigger.dataset.productName;
      viewerDescription.textContent = trigger.dataset.productDescription;
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      return;
    }

    if (event.target.closest("[data-close-viewer='true']")) {
      closeViewer();
    }
  });

  closeButton.addEventListener("click", closeViewer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("is-open")) {
      closeViewer();
    }
  });
}

function setupScrollHeader() {
  const header = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function syncHeader() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY <= 24) {
      header.classList.remove("is-hidden", "is-compact");
      lastScrollY = currentScrollY;
      return;
    }

    if (delta > 6) {
      header.classList.remove("is-hidden");
      header.classList.add("is-compact");
    } else if (delta < -6) {
      header.classList.add("is-hidden");
    }

    lastScrollY = currentScrollY;
  }

  function onScroll() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      syncHeader();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  syncHeader();
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

setupProductCards();
attachGlobalLinks();
setupImageViewer();
setupScrollHeader();
setupReveal();
