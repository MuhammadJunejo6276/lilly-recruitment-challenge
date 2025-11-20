const BASE_URL_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchMedicines();
    setupForms();
})



async function fetchMedicines() {
    const container = document.getElementById("medicines-container");
    
    try{
        const res = await fetch(`${BASE_URL_URL}/medicines`);
        if(!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        const medicines = Array.isArray(data.medicines) ? data.medicines : [];

        renderMedicines(medicines);
    } catch (err) {
        console.error("Error fetching medicines:", err);
        if (container) {
            container.innerHTML = 
            '<p class="status error">Failed to load medicines. Please try again later.</p>';
        }
    }
}

function renderMedicines(medicines) {
    const container = document.getElementById("medicines-container");
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(medicines) || medicines.length === 0) {
        container.innerHTML = "<p>No medicines found.</p>";
        return;
    }

    medicines.forEach((med, index) => {
        const name = med.name && med.name.trim() !== "" ? med.name : "unnamed medicine";
        const rawPrice = med.price;

        let priceText;
        if (typeof rawPrice === "number") {
            priceText = `£${rawPrice.toFixed(2)}`;
        } else if (rawPrice === null || rawPrice === undefined) {
            priceText = "Price not available";
        } else {
            priceText = "Invalid price";
        }

        const card = document.createElement("article");
        card.className = "medicine-card card";

        card.innerHTML = `
        <div class="med-header">
        <h3>${escapeHtml(name)}</h3>
        <span class="pill pill-index">#${index + 1}</span>
        </div>
        <p class="med-price"><strong>Price:</strong> ${priceText}</p>
        `;

        container.appendChild(card);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}