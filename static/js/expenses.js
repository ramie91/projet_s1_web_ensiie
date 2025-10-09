addEventListener("DOMContentLoaded", () => {
  // --- Filtres et recherche ---
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const table = document.querySelector("table");
  const tbody = table ? table.querySelector("tbody") : null;

  // Stocke toutes les lignes originales pour filtrage
  let allRows = [];
  if (tbody) {
    allRows = Array.from(tbody.querySelectorAll("tr"));
  }

  function normalize(str) {
    return (str || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  function filterRows() {
    const search = normalize(searchInput ? searchInput.value : "");
    const cat = categorySelect ? categorySelect.value : "";
    allRows.forEach(row => {
      // Ignore la ligne "Aucune dépense enregistrée"
      if (row.querySelector("td[colspan]")) {
        row.style.display = "";
        return;
      }
      const cells = row.querySelectorAll("td");
      const desc = cells[0]?.innerText || "";
      const category = cells[1]?.innerText || "";
      // Filtrage
      const matchSearch = search === "" || normalize(desc).includes(search);
      const matchCat = cat === "" || normalize(category).includes(normalize(cat));
      row.style.display = (matchSearch && matchCat) ? "" : "none";
    });
    // Affiche la ligne "Aucune dépense" si tout est masqué
    if (tbody) {
      const visibleRows = allRows.filter(row => row.style.display !== "none" && !row.querySelector("td[colspan]"));
      const emptyRow = allRows.find(row => row.querySelector("td[colspan]"));
      if (emptyRow) {
        emptyRow.style.display = visibleRows.length === 0 ? "" : "none";
      }
    }
  }

  if (searchInput) searchInput.addEventListener("input", filterRows);
  if (categorySelect) categorySelect.addEventListener("change", filterRows);
  const modal = document.getElementById("delete-modal");
  const modalOverlay = document.getElementById("delete-modal-overlay");
  const confirmBtn = document.getElementById("confirm-delete");
  const cancelBtn = document.getElementById("cancel-delete");

  if (!modal || !confirmBtn || !cancelBtn) {
    return;
  }

  const state = {
    id: null,
    item: null,
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    state.id = null;
    state.item = null;
  };

  const openModal = (id, item) => {
    state.id = id;
    state.item = item;
    modal.classList.remove("hidden");
    confirmBtn.focus();
  };

  document.querySelectorAll("button[data-expense-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const expenseId = button.getAttribute("data-expense-id");
      // Supporte <tr> (tableau) ou <li> (ancienne version)
      const rowItem = button.closest("tr") || button.closest("li");
      if (expenseId && rowItem) {
        openModal(expenseId, rowItem);
      }
    });
  });

  confirmBtn.addEventListener("click", () => {
    if (!state.id || !state.item) {
      closeModal();
      return;
    }

    fetch(`/expenses/delete/${state.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          state.item.remove();
          closeModal();
        } else {
          alert("Erreur lors de la suppression de la dépense.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Erreur lors de la suppression de la dépense.");
      });
  });

  const cancelHandler = () => closeModal();
  cancelBtn.addEventListener("click", cancelHandler);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", cancelHandler);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
});
