const BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchMedicines();
    setupForms();
})



async function fetchMedicines() {
    const container = document.getElementById("medicines-container");
    
    try{
        const res = await fetch(`${BASE_URL}/medicines`);
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


//     Forms  : Create , Update , Delete  

function setupForms() {
    setupCreateForm();
    setupUpdateForm();
    setupDeleteForm();
    setupAverageButton();
}

// Check if medicines already exists in inventory

function medicineExists(name) {
    const cards = document.querySelectorAll(".medicine-card h3");
    name = name.toLowerCase().trim();

    for (let card of cards) {
        if (card.textContent.toLowerCase().trim() === name) {
            return true;
        }
    }
    return false;
}


function setupCreateForm() {
    const form = document.getElementById("create-form");
    const status = document.getElementById("create-status");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (status) {
            status.textContent = "Creating...";
            status.className = "status";
        }

        const nameInput = document.getElementById("create-name");
        const priceInput = document.getElementById("create-price");

        const name = nameInput.value.trim();
        const priceValue = priceInput.value.trim();

        if(!name || !priceValue) {
            if (status) {
                status.textContent = "Please enter both name and price";
                status.classList.add("error");
            }
            return;
        }

        // Message if medicine already exists

        if (medicineExists(name)) {
                status.textContent = "This medicine already exists!";
                status.classList.add("error");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", priceValue);
        
        try {
            const res = await fetch(`${BASE_URL}/create`, {
                method:     "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }

            if (status) {
                status.textContent = "Medicine created successfully!";
                status.classList.add("success");
            }
            form.reset();
            fetchMedicines();
        }   catch (err) {
            console.error("Error creating medicine;", err);
            if (status) {
                status.textContent = "Failed to create medicine.";
                status.classList.add("error");
            }
        }
    });
}

function setupUpdateForm() {
  const form = document.getElementById("update-form");
  const status = document.getElementById("update-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (status) {
      status.textContent = "Updating...";
      status.className = "status";
    }

    const nameInput = document.getElementById("update-name");
    const priceInput = document.getElementById("update-price");

    const name = nameInput.value.trim();
    const priceValue = priceInput.value.trim();

    if (!name || !priceValue) {
      if (status) {
        status.textContent = "Please enter both name and new price.";
        status.classList.add("error");
      }
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", priceValue);

    try {
      const res = await fetch(`${BASE_URL}/update`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const msg = data.error || `HTTP error ${res.status}`;
        throw new Error(msg);
      }

      if (status) {
        status.textContent = "Medicine updated successfully!";
        status.classList.add("success");
      }
      form.reset();
      fetchMedicines();
    } catch (err) {
      console.error("Error updating medicine:", err);
      if (status) {
        status.textContent = "Failed to update medicine (check the name).";
        status.classList.add("error");
      }
    }
  });
}

function setupDeleteForm() {
  const form = document.getElementById("delete-form");
  const status = document.getElementById("delete-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (status) {
      status.textContent = "Deleting...";
      status.className = "status";
    }

    const nameInput = document.getElementById("delete-name");
    const name = nameInput.value.trim();

    if (!name) {
      if (status) {
        status.textContent = "Please enter a medicine name.";
        status.classList.add("error");
      }
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
      const res = await fetch(`${BASE_URL}/delete`, {
        method: "DELETE",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const msg = data.error || `HTTP error ${res.status}`;
        throw new Error(msg);
      }

      if (status) {
        status.textContent = "Medicine deleted successfully!";
        status.classList.add("success");
      }
      form.reset();
      fetchMedicines();
    } catch (err) {
      console.error("Error deleting medicine:", err);
      if (status) {
        status.textContent = "Failed to delete medicine (check the name).";
        status.classList.add("error");
      }
    }
  });
}

function setupAverageButton() {
    const btn = document.getElementById("avg-btn");
    const result = document.getElementById("avg-result");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        if (result) {
            result.textContent = "Calculating average...!";
            result.className = "status";
        }

        try {
            const res = await fetch  (`${BASE_URL}/medicines-average-price`);
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            const data = await res.json();

            if (!data || data.average_price === null) {
                if (result) {
                    result.textContent = data.message || "No valid prices available.";
                    result.classList.add("error");
                }
                return;
            }

            if (result) {
                result.textContent = `Average price: £${data.average_price.toFixed(
                    2
                )} (based on ${data.count} medicines)`;
                result.classList.add("success");
            }
        }   catch (err) {
            console.error("Error fetching average price.")
            if (result) {
                result.textContent = "Failed to fetch average price.";
                result.classList.add("error");
            }
        }
    });

}