// 🧠 STEP 1: Create an Axios helper instance
// - Write: const api = axios.create({...})
// - Inside axios.create(), pass an object with:
//   • Key: baseURL
//   • Value: "https://coinbase.com/api/v2/assets/prices"

const api = axios.create({
  baseURL: "https://coinbase.com/api/v2/assets/prices",
});

// 🧠 STEP 2: Make an array called "coins"
// - Store the IDs of the cryptocurrencies you want to track (e.g., "bitcoin", "ethereum").

const coins = ["bitcoin", "ethereum", "solana"];

// 🧠 STEP 3: Write a function called "createChart"
// - Parameters: (Chart, coinId, labels, data, symbol)
// - Inside this function:
//   1. Use document.getElementById() to select the container where charts will go.
//   2. Use document.createElement("canvas") to make a canvas element.
//   3. Set the canvas id to coinId and append it to the container.
//   4. Use new Chart(canvas, {...}) to create a line chart.
//   5. Pass in labels (X-axis) and data (Y-axis) from the API response.
//   6. Use symbol for the dataset label and give it a color (e.g., blue).

function createChart(Chart, coinId, labels, data, symbol) {
  const container = document.getElementById("chartSection");
  const canvas = document.createElement("canvas");
  canvas.id = coinId;
  container.appendChild(canvas);

  new Chart(canvas, {
    type: "line",
    data: {
      labels: labels, // X-axis
      datasets: [
        {
          label: symbol, // Name of the coin
          data: data, // Prices to plot
          borderColor: "blue", // Line color
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            // added currency for redability
            callback: function (value) {
              return "$" + Number(value).toLocaleString();
            },
          },
        },
      },
    },
  });
}

// 🧠 STEP 4: Write an async function called "makeCharts"
// - Inside this function:
//   1. Select the chart container and set innerHTML to a loader (e.g., "<div class='loader'></div>").
//   2. Use Promise.all() with coins.map() to fetch all coin data at once.
//   3. For each coin inside map():
//      • Call api.get("/" + coin).
//      • Extract response.data.data.prices.hour.prices and use slice(0, 24).
//      • Map timestamps to readable times using new Date(timestamp * 1000).toLocaleTimeString().
//      • Map prices to numbers using Number(price).
//      • Return an object containing coinId, labels, data, and symbol.
//   4. After fetching all data, clear the loader (innerHTML = "").
//   5. Loop over the returned data with forEach() and call createChart() for each coin.

async function makeCharts() {
  const container = document.getElementById("chartSection");

  // show loader
  container.innerHTML = "<div class='loader'></div>";

  try {
    const coinDataArray = await Promise.all(
      coins.map(async function (coinId) {
        const response = await api.get("/" + coinId);

        // get last 24 prices
        const prices = response.data.data.prices.hour.prices.slice(0, 24);

        // get time labels
        const labels = prices.map(function (item) {
          return new Date(item[0] * 1000).toLocaleTimeString();
        });

        // get price values
        const data = prices.map(function (item) {
          return Number(item[1]);
        });

        const symbol = response.data.data.base;

        return {
          coinId: coinId,
          labels: labels,
          data: data,
          symbol: symbol,
        };
      })
    );

    // clear loader
    container.innerHTML = "";

    // make charts
    coinDataArray.forEach(function (coin) {
      createChart(Chart, coin.coinId, coin.labels, coin.data, coin.symbol);
    });
  } catch (error) {
    // show error
    container.innerHTML = "<p>Oh No! Something went wrong.</p>";
    console.log(error);
  }
}

// 🧠 STEP 5: Call makeCharts() once to display charts immediately.
// - Use setInterval(makeCharts, 10000) to refresh every 10 seconds (10,000ms).

// show charts right away
makeCharts();

// update charts every 10 seconds
setInterval(makeCharts, 10000);

// ✅ IMPORTANT:
// - Use the given variable names exactly: api, coins, createChart, makeCharts.
// - Use the methods: axios.create, api.get, Promise.all, .map(), .forEach(), document.getElementById, document.createElement.
// - Follow these steps carefully to complete the project.
