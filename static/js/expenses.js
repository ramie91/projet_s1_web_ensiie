addEventListener("DOMContentLoaded", () => {
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
      const listItem = button.closest("li");
      if (expenseId && listItem) {
        openModal(expenseId, listItem);
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
