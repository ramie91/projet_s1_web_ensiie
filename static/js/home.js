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
      const expenses = await fetchData();
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
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  })();
});
