addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const modal = document.getElementById("create-modal");
  const overlay = document.getElementById("create-modal-overlay");
  const confirmBtn = document.getElementById("confirm-create");
  const cancelBtn = document.getElementById("cancel-create");
  const resetBtn = document.getElementById("reset-form");

  if (!form || !modal || !confirmBtn || !cancelBtn) {
    return;
  }

  const translate = (key) => {
    try {
      const prefs = window.appPreferences;
      if (prefs && typeof prefs.translate === "function") {
        return prefs.translate(key);
      }
    } catch (error) {
      console.warn("translation fallback used", error);
    }
    return key;
  };

  const hideModal = () => {
    modal.classList.add("hidden");
    confirmBtn.disabled = false;
    confirmBtn.textContent = translate("create.modal.confirm");
  };

  const showModal = () => {
    modal.classList.remove("hidden");
    confirmBtn.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    showModal();
  });

  confirmBtn.addEventListener("click", () => {
    const payload = {
      Title: document.getElementById("title").value.trim(),
      Amount: parseFloat(document.getElementById("amount").value),
      Currency: document.getElementById("currency").value,
      DateAchat: document.getElementById("date").value,
      Category: document.getElementById("category").value.trim(),
    };

    const userSelect = document.getElementById("user");
    if (userSelect) {
      const userId = parseInt(userSelect.value, 10);
      if (!Number.isNaN(userId)) {
        payload.UserID = userId;
      }
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = translate("create.state.submitting");

    fetch("/expense/create_expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "/login";
          return Promise.reject(new Error("unauthorized"));
        }
        if (!response.ok) {
          throw new Error("create_failed");
        }
        return response.json().catch(() => ({}));
      })
      .then(() => {
        window.location.href = "/expenses";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(translate("create.error.generic"));
        hideModal();
      })
      .finally(() => {
        confirmBtn.disabled = false;
        confirmBtn.textContent = translate("create.modal.confirm");
      });
  });

  const cancelHandler = () => hideModal();
  cancelBtn.addEventListener("click", cancelHandler);
  overlay?.addEventListener("click", cancelHandler);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      hideModal();
    }
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
  });
});
