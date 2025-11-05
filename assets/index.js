// WhatsApp number (international format without +)
const whatsappNumber = "918489391945"; // +91 8489391945

// Posters data structured by category keys
const posters = {
  F1: [
    {
      img: "assets/img/poster/F1/F1-01.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-02.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-03.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-04.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-05.jpg",
      price: 69,
      name: "Speed Legend",
    },    
  ], 
  DEMONSLAYER: [
    {
      img: "assets/img/poster/F1/F1-06.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-07.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-08.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-09.jpg",
      price: 69,
      name: "Speed Legend",
    },
    {
      img: "assets/img/poster/F1/F1-10.jpg",
      price: 69,
      name: "Speed Legend",
    },  
  ], 
};

// State & settings
let currentCategory = "F1";
let displayedCount = 0;
const perLoad = 10;

// DOM elements
const categoryContainer = document.getElementById("categoryContainer");
const posterGrid = document.getElementById("posterGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const galleryTitle = document.getElementById("galleryTitle");
const shownCountEl = document.getElementById("shownCount");
const totalCountEl = document.getElementById("totalCount");
const bannerWhatsAppBtn = document.getElementById("bannerWhatsAppBtn");

// Build category buttons from object keys
function initCategories() {
  categoryContainer.innerHTML = "";
  const keys = Object.keys(posters);
  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.className = "category-btn" + (key === currentCategory ? " active" : "");
    btn.textContent = capitalize(key);
    btn.setAttribute("data-cat", key);
    btn.addEventListener("click", () => selectCategory(key));
    categoryContainer.appendChild(btn);
  });
}

// Capitalize helper
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Render posters for the current category (append next slice)
function loadPosters() {
  const list = posters[currentCategory] || [];
  const slice = list.slice(displayedCount, displayedCount + perLoad);

  slice.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";
    col.innerHTML = `
          <div class="poster-card h-100 d-flex flex-column">
            <img class="poster-img" src="${item.img}" alt="${escapeHtml(
      item.name
    )}">
            <div class="p-3 d-flex flex-column gap-2 flex-grow-1">
              <div>
                <h6 class="mb-1">${escapeHtml(item.name)}</h6>
                <div class="small">₹${item.price}</div>
              </div>
              <div class="mt-auto d-grid">
                <button class="btn btn-outline-light btn-sm viewBtn">View & Order</button>
              </div>
            </div>
          </div>
        `;
    // add click events (both image and button)
    col
      .querySelector(".poster-img")
      .addEventListener("click", () => openWhatsApp(item));
    col
      .querySelector(".viewBtn")
      .addEventListener("click", () => openWhatsApp(item));

    posterGrid.appendChild(col);
  });

  displayedCount += slice.length;
  updateCounts();

  if (displayedCount >= list.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-block";
  }
}

// Select a category, reset grid
function selectCategory(key) {
  currentCategory = key;
  displayedCount = 0;
  posterGrid.innerHTML = "";
  document
    .querySelectorAll(".category-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelectorAll(".category-btn").forEach((btn) => {
    if (btn.getAttribute("data-cat") === key) btn.classList.add("active");
  });
  galleryTitle.textContent = capitalize(key) + " Posters";
  loadPosters();
}

// Open WhatsApp with prefilled message
function openWhatsApp(item) {
  const message = `Hi FILMAX, I want to buy "${item.name}" (₹${
    item.price
  }) from ${capitalize(currentCategory)} category.`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

// Update shown / total counts
function updateCounts() {
  const list = posters[currentCategory] || [];
  shownCountEl.textContent = Math.min(displayedCount, list.length);
  totalCountEl.textContent = list.length;
}

// Escape HTML helper to avoid injection in names
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"'`=\/]/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    }[s];
  });
}

// Initialize banner whatsapp button (orders direct with category hint)
bannerWhatsAppBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const message = `Hi FILMAX, I want to order posters from ${capitalize(
    currentCategory
  )} category. Please assist.`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
});

// Load more click
loadMoreBtn.addEventListener("click", loadPosters);

// Init
document.getElementById("year").textContent = new Date().getFullYear();
initCategories();
selectCategory(currentCategory); // loads default category

// Accessibility: keyboard support for category buttons
categoryContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const btn = e.target;
    if (btn && btn.getAttribute && btn.getAttribute("data-cat")) {
      selectCategory(btn.getAttribute("data-cat"));
    }
  }
});