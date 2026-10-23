const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
const naira = (n) => (n ? "₦" + Number(n).toLocaleString() : "");
let listings = [];

function showListingDetails(listing) {
  const set = (selector, value) => {
    document.querySelector(selector).textContent = value ?? "";
  };
  set("#dialog-title", listing.title);
  set("#dialog-address", listing.address);
  set("#dialog-price", naira(listing.price));
  set("#dialog-beds", listing.beds);
  set("#dialog-baths", listing.baths);
  set("#dialog-area", `${Number(listing.area_sqft).toLocaleString()} sq ft`);
  set("#dialog-parking", listing.parking);
  set("#dialog-amenities", listing.amenities);

  document.querySelector("#property-inquiry-form").elements.property.value = listing.title;
  document.querySelector("#inspection-form").elements.property.value = listing.title;
  document.querySelector("#inquiry-message").textContent = "";
  document.querySelector("#inspection-message").textContent = "";

  const recommendations = listings
    .filter((item) => item.id !== listing.id)
    .sort((a, b) => Number(b.type === listing.type) - Number(a.type === listing.type))
    .slice(0, 3);
  document.querySelector("#recommendation-grid").innerHTML = recommendations.map((item) => `
    <button class="recommendation-card" type="button" data-recommendation-id="${esc(item.id)}">
      <img src="${esc(item.images?.[0] || "")}" alt="${esc(item.title)}">
      <strong>${esc(item.title)}</strong>
      <span>${esc(item.location)} · ${esc(cap(item.type))}</span>
    </button>`).join("");

  const dialog = document.querySelector("#property-dialog");
  if (!dialog.open) dialog.showModal();
}

async function loadListings() {
  const grid = document.getElementById("property-grid");
  const { data, error } = await db
    .from("listings")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Unable to load property listings:", error);
    return;
  }
  listings = data || [];

  grid.insertAdjacentHTML("beforeend", listings.map((l) => `
    <article class="property-card" data-source="db"
      data-id="${esc(l.id)}"
      data-type="${esc(l.type)}"
      data-name="${esc(l.title)}"
      data-address="${esc(l.address)}"
      data-price="${esc(naira(l.price))}"
      data-beds="${esc(l.beds)}"
      data-baths="${esc(l.baths)}"
      data-area="${esc(Number(l.area_sqft).toLocaleString())} sq ft"
      data-parking="${esc(l.parking)}"
      data-amenities="${esc(l.amenities)}">
      <div class="property-image">
        <img src="${esc(l.images?.[0])}" alt="${esc(l.title)}">
      </div>
      <div class="property-meta"><div>
        <h3>${esc(l.title)}</h3>
        <p>${esc(l.location)} · ${esc(cap(l.type))}</p>
      </div></div>
      <div class="property-details">
        <span>${esc(l.beds)} beds</span>
        <span>${esc(l.baths)} baths</span>
        <span>${Number(l.area_sqft).toLocaleString()} sq ft</span>
      </div>
      <p class="property-address">${esc(l.address)}</p>
      <button class="property-enquire" type="button">View details &amp; enquire</button>
    </article>`).join(""));
    const activeFilter = document.querySelector(".filter-chip.active");
    if (activeFilter) activeFilter.click();
}

document.addEventListener("click", (e) => {
  const recommendation = e.target.closest("[data-recommendation-id]");
  if (recommendation) {
    const listing = listings.find((item) => String(item.id) === recommendation.dataset.recommendationId);
    if (listing) showListingDetails(listing);
    return;
  }

  const button = e.target.closest(".property-enquire");
  if (!button) return;
  const card = button.closest(".property-card");
  if (!card || card.dataset.source !== "db") return;
  const listing = listings.find((item) => String(item.id) === card.dataset.id);
  if (listing) showListingDetails(listing);
});

loadListings();