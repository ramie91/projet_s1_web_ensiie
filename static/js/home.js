const FALLBACK_CATEGORY_KEY = "__fallback__";
const FALLBACK_TRANSLATIONS = {
  "stats.totalTransactions": "{count} dépense(s)",
  "stats.monthTransactions": "{count} dépense(s)",
  "stats.topCategoryLabel": "{category} ({amount})",
  "stats.noTopCategory": "Aucune donnée disponible",
  "categories.other": "Autres",
  "chart.noData": "Aucune donnée",
  "chart.expenseDistribution": "Répartition des dépenses (en EUR)",
};

let expenses = [];
let statsSnapshot = null;
let chartInstance = null;

const getPreferences = () => {
  const defaultLang = document.documentElement.lang || "fr";
  return window.appPreferences || {
    getLanguage: () => defaultLang,
    translate: (key, vars) => {
      if (!vars) {
        return key;
      }
      return Object.entries(vars).reduce((acc, [varKey, value]) => {
        return acc.replace(new RegExp(`{${varKey}}`, "g"), value);
      }, key);
    },
    onLanguageChange: (callback) => {
      if (typeof callback !== "function") {
        return () => {};
      }
      const handler = (event) => callback(event.detail?.lang || defaultLang);
      window.addEventListener("app:language-change", handler);
      return () => window.removeEventListener("app:language-change", handler);
    },
  };
};

async function getUser() {
  const response = await fetch("/get_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("failed_to_load_user");
  }
  const user = await response.json();
  console.log("User :" + JSON.stringify(user));

  return user;
}

async function fetchData() {
  const response = await fetch("/get_expenses_by_category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("failed_to_load_data");
  }

  return response.json();
}

const interpolate = (template, vars = {}) => {
  return Object.entries(vars).reduce((acc, [varKey, value]) => {
    const matcher = new RegExp(`{${varKey}}`, "g");
    return acc.replace(matcher, value);
  }, template);
};

const createTranslator = (prefs) => {
  const translator = prefs.translate || ((key) => key);
  return (key, vars) => {
    const candidate = translator(key, vars);
    if (candidate && candidate !== key) {
      return candidate;
    }

    const fallbackTemplate = FALLBACK_TRANSLATIONS[key];
    if (!fallbackTemplate) {
      return candidate;
    }

    return interpolate(fallbackTemplate, vars);
  };
};

const computeStats = (expenseList) => {
  let totalAmount = 0;
  let totalCount = 0;
  let monthAmount = 0;
  let monthCount = 0;
  const totalsByCategory = new Map();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  expenseList.forEach((expense) => {
    const amount = Number(expense.Amount) || 0;
    totalAmount += amount;
    totalCount += 1;

    const purchaseDate = new Date(expense.DateAchat);
    if (!Number.isNaN(purchaseDate.getTime()) && purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear) {
      monthAmount += amount;
      monthCount += 1;
    }

    const categoryRaw = typeof expense.Category === "string" ? expense.Category.trim() : "";
    const categoryKey = categoryRaw ? categoryRaw : FALLBACK_CATEGORY_KEY;
    totalsByCategory.set(categoryKey, (totalsByCategory.get(categoryKey) || 0) + amount);
  });

  let topCategoryKey = null;
  let topCategoryAmount = 0;
  totalsByCategory.forEach((amount, key) => {
    if (amount > topCategoryAmount) {
      topCategoryAmount = amount;
      topCategoryKey = key;
    }
  });

  const chartBuckets = Array.from(totalsByCategory.entries()).map(([key, amount]) => ({
    key,
    amount,
  }));

  return {
    totalAmount,
    totalCount,
    monthAmount,
    monthCount,
    topCategoryKey,
    topCategoryAmount,
    chartBuckets,
  };
};

const getLocaleFromLang = (lang) => {
  if (lang === "fr") {
    return "fr-FR";
  }
  if (lang === "en") {
    return "en-US";
  }
  return lang || "fr-FR";
};

const renderStats = () => {
  if (!statsSnapshot) {
    return;
  }

  const prefs = getPreferences();
  const lang = prefs.getLanguage ? prefs.getLanguage() : document.documentElement.lang || "fr";
  const locale = getLocaleFromLang(lang);
  const translate = createTranslator(prefs);
  const currencyFormatter = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" });

  const totalAmountEl = document.getElementById("montant-depense-global");
  if (totalAmountEl) {
    totalAmountEl.textContent = currencyFormatter.format(statsSnapshot.totalAmount);
  }

  const totalCountEl = document.getElementById("nbtransaction-depense-global");
  if (totalCountEl) {
    totalCountEl.textContent = translate("stats.totalTransactions", { count: statsSnapshot.totalCount });
  }

  const monthAmountEl = document.getElementById("montant-depense-mois");
  if (monthAmountEl) {
    monthAmountEl.textContent = currencyFormatter.format(statsSnapshot.monthAmount);
  }

  const monthCountEl = document.getElementById("nbtransaction-depense-mois");
  if (monthCountEl) {
    monthCountEl.textContent = translate("stats.monthTransactions", { count: statsSnapshot.monthCount });
  }

  const categoryAmountEl = document.getElementById("montant-depense-categorie");
  const categoryLabelEl = document.getElementById("categorie-principale");

  if (categoryAmountEl) {
    categoryAmountEl.textContent = currencyFormatter.format(statsSnapshot.topCategoryAmount);
  }

  if (categoryLabelEl) {
    if (statsSnapshot.topCategoryKey) {
      const categoryLabel =
        statsSnapshot.topCategoryKey === FALLBACK_CATEGORY_KEY
          ? translate("categories.other")
          : statsSnapshot.topCategoryKey;
      const formattedAmount = currencyFormatter.format(statsSnapshot.topCategoryAmount);
      categoryLabelEl.textContent = translate("stats.topCategoryLabel", {
        category: categoryLabel,
        amount: formattedAmount,
      });
    } else {
      categoryLabelEl.textContent = translate("stats.noTopCategory");
    }
  }
};

const renderChart = () => {
  const canvas = document.getElementById("myChart");
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  const prefs = getPreferences();
  const translate = createTranslator(prefs);

  const labels =
    statsSnapshot && statsSnapshot.chartBuckets.length > 0
      ? statsSnapshot.chartBuckets.map((bucket) =>
          bucket.key === FALLBACK_CATEGORY_KEY ? translate("categories.other") : bucket.key
        )
      : [translate("chart.noData")];

  const dataValues =
    statsSnapshot && statsSnapshot.chartBuckets.length > 0
      ? statsSnapshot.chartBuckets.map((bucket) => Number(bucket.amount) || 0)
      : [1];

  const datasetLabel = translate("chart.expenseDistribution");

  if (!chartInstance) {
    chartInstance = new Chart(canvas, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: datasetLabel,
            data: dataValues,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  } else {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = dataValues;
    chartInstance.data.datasets[0].label = datasetLabel;
    chartInstance.update();
  }
};

const initialiseLanguageWatcher = () => {
  const prefs = getPreferences();
  if (prefs && typeof prefs.onLanguageChange === "function") {
    prefs.onLanguageChange(() => {
      renderStats();
      renderChart();
    });
    return;
  }

  window.addEventListener("app:language-change", () => {
    renderStats();
    renderChart();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myChart");
  if (!canvas) {
    return;
  }

  initialiseLanguageWatcher();

  (async () => {
    try {
      expenses = await fetchData();
      console.log("Dépenses récupérées :", expenses);

      statsSnapshot = computeStats(expenses);

      renderStats();
      renderChart();
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  })();
});
