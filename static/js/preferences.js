(() => {
  const translations = {
    fr: {
      "brand.name": "CheckMate",
      "nav.home": "Accueil",
      "nav.addExpense": "Ajouter une dépense",
      "nav.expenses": "Dépenses",
      "nav.login": "Connexion",
      "nav.register": "Créer un compte",
      "nav.logout": "Déconnexion",
      "nav.admin": "Panel admin",
      "action.switchEnglish": "Passer en anglais",
      "action.switchFrench": "Passer en français",
      "action.enableDark": "Activer le mode nuit",
      "action.enableLight": "Activer le mode jour",
      "action.back": "Retour",
      "action.backHome": "Retour à l'accueil",
      "action.cancel": "Annuler",
      "action.confirm": "Valider",
      "action.delete": "Supprimer",
      "action.reset": "Réinitialiser",
      "action.submit": "Ajouter",
      "home.heading": "Accueil",
      "home.tagline": "Visualisez vos dépenses avec CheckMate.",
      "home.ctaLogin": "Se connecter",
      "home.totalSpent": "Total dépensé",
      "home.thisMonth": "Ce mois-ci",
      "home.topCategory": "Catégorie principale",
      "footer.rights": "\u00A9 2025 Nasseraldin Ramie. Tous droits réservés.",
      "footer.tagline": "Créé avec soin pour simplifier vos partages de frais.",
      "stats.totalTransactions": "{count} dépense(s)",
      "stats.monthTransactions": "{count} dépense(s)",
      "stats.topCategoryLabel": "{category} ({amount})",
      "stats.noTopCategory": "Aucune donnée disponible",
      "chart.expenseDistribution": "Répartition des dépenses (en EUR)",
      "chart.noData": "Aucune donnée",
      "categories.other": "Autres",
      "expenses.heading": "Liste des dépenses",
      "expenses.filter.searchPlaceholder": "Rechercher une dépense...",
      "expenses.filter.allCategories": "Toutes les catégories",
      "expenses.table.descriptionHeader": "Description",
      "expenses.table.userHeader": "Utilisateur",
      "expenses.table.categoryHeader": "Catégorie",
      "expenses.table.dateHeader": "Date",
      "expenses.table.amountHeader": "Montant",
      "expenses.table.actionsHeader": "Actions",
      "expenses.table.unknownUser": "Utilisateur inconnu",
      "expenses.table.empty": "Aucune dépense enregistrée",
      "expenses.table.deleteTitle": "Supprimer",
      "expenses.modal.title": "Supprimer cette dépense ?",
      "expenses.modal.body": "Cette action est irréversible. La dépense sera définitivement supprimée de votre historique.",
      "expenses.modal.cancel": "Annuler",
      "expenses.modal.confirm": "Supprimer",
      "create.heading": "Créer une dépense",
      "create.label.title": "Titre",
      "create.placeholder.title": "Ex: Pizza, Uber…",
      "create.label.user": "Utilisateur",
      "create.label.amount": "Montant",
      "create.label.currency": "Devise",
      "create.label.category": "Catégorie",
      "create.label.date": "Date d'achat",
      "create.button.reset": "Réinitialiser",
      "create.button.submit": "Ajouter",
      "create.state.submitting": "Création...",
      "create.error.generic": "Erreur lors de la création de la dépense.",
      "create.modal.title": "Valider la dépense ?",
      "create.modal.body": "Confirmez la création de cette dépense. Elle sera ajoutée à votre liste.",
      "create.modal.cancel": "Annuler",
      "create.modal.confirm": "Valider",
      "category.label.Logement": "Logement",
      "category.label.Alimentation": "Alimentation",
      "category.label.Transport": "Transport",
      "category.label.Sante": "Santé & Bien-être",
      "category.label.Loisirs": "Loisirs & Culture",
      "category.label.Education": "Éducation & Formation",
      "category.label.Achats": "Achats divers",
      "category.label.Impots": "Impôts & Services financiers",
      "category.label.Famille": "Famille & Cadeaux",
      "category.label.Autres": "Autres / Divers",
      "login.heading": "Connexion",
      "login.subheading": "Accédez à vos dépenses en vous connectant.",
      "login.label.email": "Email",
      "login.placeholder.email": "vous@example.com",
      "login.label.password": "Mot de passe",
      "login.placeholder.password": "••••••••",
      "login.button.submit": "Se connecter",
      "login.demoNotice": "Compte démo : demo@example.com / mot de passe : demo",
      "login.adminNotice": "Admin démo : admin@example.com / mot de passe : admin",
      "login.signupPrompt": "Pas encore de compte ?",
      "login.signupLink": "Créer un compte",
      "register.heading": "Créer un compte",
      "register.subheading": "Rejoignez CheckMate pour suivre vos dépenses.",
      "register.label.name": "Nom",
      "register.placeholder.name": "Jean Dupont",
      "register.label.email": "Email",
      "register.placeholder.email": "vous@example.com",
      "register.label.password": "Mot de passe",
      "register.placeholder.password": "••••••••",
      "register.button.submit": "S'inscrire",
      "register.signinPrompt": "Déjà un compte ?",
      "register.signinLink": "Se connecter",
      "expenses.error.delete": "Erreur lors de la suppression de la dépense.",
      "admin.heading": "Espace administrateur",
      "admin.subheading": "Gérez les utilisateurs et surveillez les dépenses globales.",
      "admin.metrics.totalUsers.label": "Utilisateurs",
      "admin.metrics.totalUsers.caption": "Comptes enregistrés",
      "admin.metrics.totalExpenses.label": "Dépenses",
      "admin.metrics.totalExpenses.caption": "Total des enregistrements",
      "admin.users.title": "Utilisateurs",
      "admin.users.table.name": "Nom",
      "admin.users.table.email": "Email",
      "admin.users.table.expenses": "Dépenses",
      "admin.users.badge.admin": "Admin",
      "admin.recent.title": "Dernières dépenses",
      "admin.recent.empty": "Aucune dépense trouvée.",
    },
    en: {
      "brand.name": "CheckMate",
      "nav.home": "Home",
      "nav.addExpense": "Add an expense",
      "nav.expenses": "Expenses",
      "nav.login": "Sign in",
      "nav.register": "Create an account",
      "nav.logout": "Sign out",
      "nav.admin": "Admin panel",
      "action.switchEnglish": "Switch to French",
      "action.switchFrench": "Switch to French",
      "action.enableDark": "Enable dark mode",
      "action.enableLight": "Enable light mode",
      "action.back": "Back",
      "action.backHome": "Back to home",
      "action.cancel": "Cancel",
      "action.confirm": "Confirm",
      "action.delete": "Delete",
      "action.reset": "Reset",
      "action.submit": "Add",
      "home.heading": "Home",
      "home.tagline": "Visualise your expenses with CheckMate.",
      "home.ctaLogin": "Sign in",
      "home.totalSpent": "Total spent",
      "home.thisMonth": "This month",
      "home.topCategory": "Top category",
      "footer.rights": "\u00A9 2025 Nasseraldin Ramie. All rights reserved.",
      "footer.tagline": "Carefully crafted to simplify sharing expenses.",
      "stats.totalTransactions": "{count} expense(s)",
      "stats.monthTransactions": "{count} expense(s)",
      "stats.topCategoryLabel": "{category} ({amount})",
      "stats.noTopCategory": "No data available",
      "chart.expenseDistribution": "Expense distribution (EUR)",
      "chart.noData": "No data",
      "categories.other": "Other",
      "expenses.heading": "Expenses list",
      "expenses.filter.searchPlaceholder": "Search an expense...",
      "expenses.filter.allCategories": "All categories",
      "expenses.table.descriptionHeader": "Description",
      "expenses.table.userHeader": "User",
      "expenses.table.categoryHeader": "Category",
      "expenses.table.dateHeader": "Date",
      "expenses.table.amountHeader": "Amount",
      "expenses.table.actionsHeader": "Actions",
      "expenses.table.unknownUser": "Unknown user",
      "expenses.table.empty": "No expenses recorded",
      "expenses.table.deleteTitle": "Delete",
      "expenses.modal.title": "Delete this expense?",
      "expenses.modal.body": "This action cannot be undone. The expense will be permanently removed from your history.",
      "expenses.modal.cancel": "Cancel",
      "expenses.modal.confirm": "Delete",
      "create.heading": "Create an expense",
      "create.label.title": "Title",
      "create.placeholder.title": "e.g. Pizza, Uber…",
      "create.label.user": "User",
      "create.label.amount": "Amount",
      "create.label.currency": "Currency",
      "create.label.category": "Category",
      "create.label.date": "Purchase date",
      "create.button.reset": "Reset",
      "create.button.submit": "Add",
      "create.state.submitting": "Creating...",
      "create.error.generic": "Error while creating the expense.",
      "create.modal.title": "Confirm this expense?",
      "create.modal.body": "Confirm the creation of this expense. It will be added to your list.",
      "create.modal.cancel": "Cancel",
      "create.modal.confirm": "Confirm",
      "category.label.Logement": "Housing",
      "category.label.Alimentation": "Food",
      "category.label.Transport": "Transport",
      "category.label.Sante": "Health & Wellness",
      "category.label.Loisirs": "Leisure & Culture",
      "category.label.Education": "Education & Training",
      "category.label.Achats": "Shopping",
      "category.label.Impots": "Taxes & Financial services",
      "category.label.Famille": "Family & Gifts",
      "category.label.Autres": "Other / Miscellaneous",
      "login.heading": "Sign in",
      "login.subheading": "Access your expenses by signing in.",
      "login.label.email": "Email",
      "login.placeholder.email": "you@example.com",
      "login.label.password": "Password",
      "login.placeholder.password": "••••••••",
      "login.button.submit": "Sign in",
      "login.demoNotice": "Demo account: demo@example.com / password: demo",
      "login.adminNotice": "Admin demo: admin@example.com / password: admin",
      "login.signupPrompt": "Don't have an account yet?",
      "login.signupLink": "Create an account",
      "expenses.error.delete": "Error while deleting the expense.",
      "register.heading": "Create an account",
      "register.subheading": "Join CheckMate to track your expenses.",
      "register.label.name": "Name",
      "register.placeholder.name": "John Doe",
      "register.label.email": "Email",
      "register.placeholder.email": "you@example.com",
      "register.label.password": "Password",
      "register.placeholder.password": "••••••••",
      "register.button.submit": "Sign up",
      "register.signinPrompt": "Already have an account?",
      "register.signinLink": "Sign in",
      "admin.heading": "Admin space",
      "admin.subheading": "Manage users and monitor global spending.",
      "admin.metrics.totalUsers.label": "Users",
      "admin.metrics.totalUsers.caption": "Registered accounts",
      "admin.metrics.totalExpenses.label": "Expenses",
      "admin.metrics.totalExpenses.caption": "Total records",
      "admin.users.title": "Users",
      "admin.users.table.name": "Name",
      "admin.users.table.email": "Email",
      "admin.users.table.expenses": "Expenses",
      "admin.users.badge.admin": "Admin",
      "admin.recent.title": "Latest expenses",
      "admin.recent.empty": "No expenses found.",
    },
  };

  const listeners = {
    language: new Set(),
    theme: new Set(),
  };

  // Lecture/écriture localStorage protégée (mode privé, quotas, etc.).
  const getStoredPreference = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ?? fallback;
    } catch (error) {
      console.warn("Impossible de récupérer la préférence :", key, error);
      return fallback;
    }
  };

  const setStoredPreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Impossible d'enregistrer la préférence :", key, error);
    }
  };

  let currentLang = (() => {
    const stored = getStoredPreference("app-language", document.documentElement.lang || "fr");
    return translations[stored] ? stored : "fr";
  })();

  let currentTheme = (() => {
    const stored = getStoredPreference("app-theme", null);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  })();

  const translate = (key, vars = {}) => {
    const fallback = translations.fr[key];
    const dictionary = translations[currentLang] || {};
    let template = dictionary[key] ?? fallback ?? key;

    if (typeof template !== "string") {
      return template;
    }

    return Object.entries(vars).reduce((acc, [varKey, value]) => {
      const matcher = new RegExp(`{${varKey}}`, "g");
      return acc.replace(matcher, value);
    }, template);
  };

  let themeButton = null;
  let languageButton = null;

  const refreshThemeToggle = () => {
    if (!themeButton) {
      return;
    }

    // Alterne l’icône/label du bouton en fonction du thème courant.
    const themeIcon = themeButton.querySelector(".theme-icon");
    const themeLabel = themeButton.querySelector(".theme-label");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    themeButton.dataset.themeTarget = nextTheme;
    themeButton.setAttribute("aria-pressed", currentTheme === "dark" ? "true" : "false");

    if (themeIcon) {
      themeIcon.textContent = nextTheme === "dark" ? "🌙" : "🌞";
    }
    if (themeLabel) {
      const labelKey = nextTheme === "dark" ? "action.enableDark" : "action.enableLight";
      themeLabel.textContent = translate(labelKey);
    }
  };

  const refreshLanguageToggle = () => {
    if (!languageButton) {
      return;
    }

    const languageLabel = languageButton.querySelector(".language-label");
    const nextLang = currentLang === "fr" ? "en" : "fr";
    languageButton.dataset.targetLang = nextLang;

    if (languageLabel) {
      const labelKey = nextLang === "en" ? "action.switchEnglish" : "action.switchFrench";
      languageLabel.textContent = translate(labelKey);
    }
  };

  const translateAttribute = (element, datasetKey, translationKey) => {
    if (!translationKey) {
      return;
    }
    const translated = translate(translationKey);
    if (!translated || translated === translationKey) {
      return;
    }

    // data-i18n => textContent ; data-i18n-placeholder => placeholder, etc.
    if (datasetKey === "i18n") {
      element.textContent = translated;
      return;
    }

    const attributeName = datasetKey
      .slice(4)
      .replace(/([A-Z])/g, "-$1")
      .replace(/^-/, "")
      .toLowerCase();

    if (!attributeName) {
      return;
    }

    if (attributeName === "html") {
      element.innerHTML = translated;
    } else if (attributeName === "value") {
      element.value = translated;
    } else {
      element.setAttribute(attributeName, translated);
    }
  };

  const applyTranslations = () => {
    // Re-traduit tout le DOM ciblé par data-i18n*, puis rafraîchit les boutons.
    document.documentElement.setAttribute("lang", currentLang);
    const elements = document.querySelectorAll("[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-label], [data-i18n-aria-label], [data-i18n-value], [data-i18n-html]");
    elements.forEach((element) => {
      Object.entries(element.dataset).forEach(([datasetKey, translationKey]) => {
        if (!datasetKey.startsWith("i18n")) {
          return;
        }
        translateAttribute(element, datasetKey, translationKey);
      });
    });
    refreshLanguageToggle();
    refreshThemeToggle();
  };

  const applyTheme = (theme, { emit } = { emit: true }) => {
    currentTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
    setStoredPreference("app-theme", currentTheme);
    refreshThemeToggle();

    if (emit) {
      listeners.theme.forEach((callback) => callback(currentTheme));
      window.dispatchEvent(new CustomEvent("app:theme-change", { detail: { theme: currentTheme } }));
    }
  };

  const applyLanguage = (lang, { emit } = { emit: true }) => {
    const nextLang = translations[lang] ? lang : "fr";
    if (nextLang === currentLang && emit) {
      // Even if language unchanged we still ensure UI matches stored preference.
      applyTranslations();
      return;
    }

    currentLang = nextLang;
    setStoredPreference("app-language", currentLang);
    applyTranslations();

    if (emit) {
      listeners.language.forEach((callback) => callback(currentLang));
      window.dispatchEvent(new CustomEvent("app:language-change", { detail: { lang: currentLang } }));
    }
  };

  const bindControls = () => {
    themeButton = document.querySelector('[data-action="toggle-theme"]');
    languageButton = document.querySelector('[data-action="toggle-language"]');

    // Buttons de navbar : switch langue/thème en un clic.
    if (languageButton) {
      languageButton.addEventListener("click", () => {
        const nextLang = currentLang === "fr" ? "en" : "fr";
        applyLanguage(nextLang);
      });
    }

    if (themeButton) {
      themeButton.addEventListener("click", () => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      });
    }
  };

  const preferencesApi = {
    getLanguage: () => currentLang,
    getTheme: () => currentTheme,
    translate,
    setLanguage: (lang) => applyLanguage(lang),
    setTheme: (theme) => applyTheme(theme),
    onLanguageChange: (callback) => {
      if (typeof callback !== "function") {
        return () => {};
      }
      listeners.language.add(callback);
      return () => listeners.language.delete(callback);
    },
    onThemeChange: (callback) => {
      if (typeof callback !== "function") {
        return () => {};
      }
      listeners.theme.add(callback);
      return () => listeners.theme.delete(callback);
    },
  };

  window.appPreferences = preferencesApi;

  const initialise = () => {
    // Applique le thème/langue stockés sans émettre d’événement, puis bind les boutons.
    bindControls();
    applyTheme(currentTheme, { emit: false });
    applyLanguage(currentLang, { emit: false });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
