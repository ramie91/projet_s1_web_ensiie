var expenses;

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

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myChart");
  if (!canvas) {
    return;
  }

  (async () => {
    try {
      expenses = await fetchData();
      console.log("Dépenses récupérées :", expenses);
      const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.Category || "Autres";
        const amount = Number(expense.Amount) || 0;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      const labels = Object.keys(categoryTotals);
      const dataValues = labels.map((label) => categoryTotals[label]);

      const data = {
        labels: labels.length > 0 ? labels : ["Aucune donnée"],
        datasets: [
          {
            label: "Répartition des dépenses (en EUR)",
            data: dataValues.length > 0 ? dataValues : [1],
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
      };

      const config = {
        type: "pie",
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      };

      new Chart(canvas, config);
      let totalDepense = 0;
      let totalTransaction = 0;
      let totalDepenseMois = 0;
      let totalTransactionMois = 0;
      let topCategory = {};
      for (let i = 0; i < expenses.length; i++) {
        totalDepense += Number(expenses[i].Amount) || 0;
        totalTransaction += 1;
        if (new Date(expenses[i].Date).getMonth() === new Date().getMonth()) {
          totalDepenseMois += Number(expenses[i].Amount) || 0;
          totalTransactionMois += 1;
        }
        const category = expenses[i].Category || "Autres";
        const amount = Number(expenses[i].Amount) || 0;
        topCategory[category] = (topCategory[category] || 0) + amount;
      }
      const topCategoryLabel = Object.keys(topCategory).reduce((a, b) =>
        topCategory[a] > topCategory[b] ? a : b
      );
      const topCategoryAmount = topCategory[topCategoryLabel] || 0;
      document.getElementById("montant-depense-global").innerText = `${totalDepense} €`;
      document.getElementById("nbtransaction-depense-global").innerText = `${totalTransaction} dépense(s)`;
      document.getElementById("montant-depense-mois").innerText = `${totalDepenseMois} €`;
      document.getElementById("nbtransaction-depense-mois").innerText = `${totalTransactionMois} dépense(s)`;
      document.getElementById("categorie-principale").innerText = `${topCategoryLabel} (${topCategoryAmount} €)`;
      document.getElementById("montant-depense-categorie").innerText = `${topCategoryAmount} €`;
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  })();
  

});
