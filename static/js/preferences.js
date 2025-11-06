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
      "action.switchEnglish": "Passer en anglais",
      "action.switchFrench": "Passer en français",
      "action.enableDark": "Activer le mode nuit",
      "action.enableLight": "Activer le mode jour",
      "home.heading": "Accueil",
      "home.tagline": "Visualisez vos dépenses avec CheckMate.",
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
    },
    en: {
      "brand.name": "CheckMate",
      "nav.home": "Home",
      "nav.addExpense": "Add an expense",
      "nav.expenses": "Expenses",
      "nav.login": "Sign in",
      "nav.register": "Create an account",
      "nav.logout": "Sign out",
      "action.switchEnglish": "Switch to English",
      "action.switchFrench": "Switch to French",
      "action.enableDark": "Enable dark mode",
      "action.enableLight": "Enable light mode",
      "home.heading": "Home",
      "home.tagline": "Visualise your expenses with CheckMate.",
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
    },
  };

  const listeners = {
    language: new Set(),
    theme: new Set(),
  };

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

  const applyTranslations = () => {
    document.documentElement.setAttribute("lang", currentLang);
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (!key) {
        return;
      }
      const translated = translate(key);
      if (translated) {
        element.textContent = translated;
      }
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
