const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
const naira = (n) => (n ? "₦" + Number(n).toLocaleString() : "");

async function loadListings() {
  const grid = document.getElementById("property-grid");
  const { data, error } = await db
    .from("listings")
    .select("*")
    .order("created_at", { ascending: true });

 
  if (error) { console.error(error); return; }

  grid.insertAdjacentHTML("beforeend", data.map((l) => `
    <article class="property-card" data-source="db"
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
}

document.addEventListener("click", (e) => {
  const button = e.target.closest(".property-enquire");
  if (!button) return;
  const card = button.closest(".property-card");
  if (!card || card.dataset.source !== "db") return;

  const d = card.dataset;
  const set = (id, v) => (document.querySelector(id).textContent = v ?? "");
  set("#dialog-title", d.name);
  set("#dialog-address", d.address);
  set("#dialog-price", d.price);
  set("#dialog-beds", d.beds);
  set("#dialog-baths", d.baths);
  set("#dialog-area", d.area);
  set("#dialog-parking", d.parking);
  set("#dialog-amenities", d.amenities);

  document.querySelector("#property-inquiry-form").elements.property.value = d.name;
  document.querySelector("#inquiry-message").textContent = "";
  document.querySelector("#property-dialog").showModal();
});

loadListings();