const listingsKey = "dowman-admin-prototype-listings";

(async () => {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    window.location.replace("login.html");
    return;
  }
  startDashboard();
})();

function startDashboard() {
  const listingGrid = document.querySelector("#listing-grid");
  const listingDialog = document.querySelector("#listing-dialog");
  const listingForm = document.querySelector("#listing-form");
  const emptyState = document.querySelector("#empty-state");
  const searchInput = document.querySelector("#listing-search");
  const toast = document.querySelector("#toast");
  let listings = readListings();
  let activeFilter = "all";
  let toastTimeout;

  function readListings() {
    try {
      const stored = localStorage.getItem(listingsKey);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error("Saved listings must be a list.");
      return parsed;
    } catch (error) {
      console.error("Unable to read the prototype listings from this browser:", error);
      return [];
    }
  }

  function saveListings() {
    try {
      localStorage.setItem(listingsKey, JSON.stringify(listings));
      return true;
    } catch (error) {
      console.error("Unable to save prototype listings in this browser:", error);
      showToast("Could not save in this browser. Check available storage.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function formatPrice(value) {
    return `₦${Number(value).toLocaleString("en-NG")}`;
  }

  function formatType(type) {
    return type ? type[0].toUpperCase() + type.slice(1) : "Property";
  }

  function getVisibleListings() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    return listings.filter((listing) => {
      const matchesFilter = activeFilter === "all" || listing.type === activeFilter;
      const matchesSearch = !query || [listing.title, listing.location, listing.address, listing.type]
        .some((value) => String(value ?? "").toLocaleLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }

  function renderListings() {
    const visibleListings = getVisibleListings();
    listingGrid.innerHTML = visibleListings.map((listing) => {
      const image = Array.isArray(listing.images) ? listing.images[0] : "";
      const imageMarkup = image
        ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(listing.title)}" loading="lazy">`
        : `<span class="empty-icon" aria-hidden="true">⌂</span>`;
      const facts = [
        listing.beds !== "" && listing.beds != null ? `${escapeHTML(listing.beds)} beds` : "",
        listing.baths !== "" && listing.baths != null ? `${escapeHTML(listing.baths)} baths` : "",
        listing.area_sqft !== "" && listing.area_sqft != null ? `${Number(listing.area_sqft).toLocaleString()} sq ft` : ""
      ].filter(Boolean);

      return `<article class="listing-card" data-listing-id="${escapeHTML(listing.id)}">
        <div class="listing-image">${imageMarkup}<span class="type-badge">${escapeHTML(formatType(listing.type))}</span></div>
        <div class="listing-content">
          <h3 class="listing-title" title="${escapeHTML(listing.title)}">${escapeHTML(listing.title)}</h3>
          <p class="listing-location">${escapeHTML(listing.location)}${listing.address ? ` · ${escapeHTML(listing.address)}` : ""}</p>
          <p class="listing-price">${formatPrice(listing.price)}</p>
          ${facts.length ? `<div class="listing-facts">${facts.join("")}</div>` : ""}
          <div class="listing-actions"><span class="listing-date">Added ${escapeHTML(new Date(listing.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }))}</span><button class="delete-button" type="button" data-delete-id="${escapeHTML(listing.id)}" aria-label="Delete ${escapeHTML(listing.title)}">Delete</button></div>
        </div>
      </article>`;
    }).join("");

    const hasListings = listings.length > 0;
    emptyState.classList.toggle("visible", visibleListings.length === 0);
    listingGrid.hidden = visibleListings.length === 0;
    document.querySelector("#empty-title").textContent = hasListings ? "No matching listings." : "Your collection starts here.";
    document.querySelector("#empty-copy").textContent = hasListings
      ? "Try a different search or choose another property type."
      : "Add your first listing to begin building your property collection.";
    document.querySelector("#empty-add-button").hidden = hasListings;

    document.querySelector("#total-count").textContent = listings.length;
    document.querySelector("#nav-listing-count").textContent = listings.length;
    document.querySelector("#heading-count").textContent = listings.length;
    document.querySelector("#house-count").textContent = listings.filter((item) => item.type === "house").length;
    document.querySelector("#apartment-count").textContent = listings.filter((item) => item.type === "apartment").length;
    document.querySelector("#townhouse-count").textContent = listings.filter((item) => item.type === "townhouse").length;
    document.querySelector("#result-count").textContent = `${visibleListings.length} ${visibleListings.length === 1 ? "listing" : "listings"}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2800);
  }

  function openListingForm() {
    listingForm.reset();
    listingDialog.showModal();
    listingForm.elements.title.focus();
  }

  document.querySelector("#open-listing-form").addEventListener("click", openListingForm);
  document.querySelector("#empty-add-button").addEventListener("click", openListingForm);

  document.querySelector("#close-listing-form").addEventListener("click", () => listingDialog.close());
  document.querySelector("#cancel-listing-form").addEventListener("click", () => listingDialog.close());
  listingDialog.addEventListener("click", (event) => {
    if (event.target === listingDialog) listingDialog.close();
  });

  listingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!listingForm.reportValidity()) return;

    const values = new FormData(listingForm);
    const image = String(values.get("image") || "").trim();
    const listing = {
      id: crypto.randomUUID(),
      title: String(values.get("title")).trim(),
      type: String(values.get("type")),
      location: String(values.get("location")).trim(),
      address: String(values.get("address") || "").trim(),
      price: Number(values.get("price")),
      beds: values.get("beds") ? Number(values.get("beds")) : null,
      baths: values.get("baths") ? Number(values.get("baths")) : null,
      area_sqft: values.get("area_sqft") ? Number(values.get("area_sqft")) : null,
      parking: values.get("parking") ? Number(values.get("parking")) : null,
      amenities: String(values.get("amenities") || "").trim(),
      images: image ? [image] : [],
      created_at: new Date().toISOString()
    };

    listings = [listing, ...listings];
    if (!saveListings()) {
      listings = listings.filter((item) => item.id !== listing.id);
      return;
    }
    listingDialog.close();
    renderListings();
    showToast("Listing added to this browser.");
  });

  listingGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button) return;
    const listing = listings.find((item) => item.id === button.dataset.deleteId);
    if (!listing || !window.confirm(`Delete "${listing.title}" from this browser?`)) return;

    const previousListings = listings;
    listings = listings.filter((item) => item.id !== listing.id);
    if (!saveListings()) {
      listings = previousListings;
      return;
    }
    renderListings();
    showToast("Listing removed from this browser.");
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        const selected = filterButton === button;
        filterButton.classList.toggle("active", selected);
        filterButton.setAttribute("aria-pressed", String(selected));
      });
      renderListings();
    });
  });

  searchInput.addEventListener("input", renderListings);
  document.querySelector(".banner-dismiss").addEventListener("click", () => {
    document.querySelector(".prototype-banner").hidden = true;
  });
  document.querySelector("#logout-button").addEventListener("click", async() => {
    await db.auth.signOut();
    window.location.replace("login.html");
  });

  renderListings();
}
