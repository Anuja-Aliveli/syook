let successfulOperations = 0;
let totalOperations = 0;

const updateSuccessRate = () => {
  const successRate = (successfulOperations / totalOperations) * 100;
  const successRateElement = document.getElementById("success-rate");
  successRateElement.textContent = `Success Rate: ${successRate.toFixed(2)}%`;
};

const insertRow = (data) => {
  const table = document.getElementById("data-table");
  const row = table.insertRow();
  const nameCell = row.insertCell(0);
  const originCell = row.insertCell(1);
  const destinationCell = row.insertCell(2);
  const timestampCell = row.insertCell(3);

  nameCell.textContent = data.name;
  originCell.textContent = data.origin;
  destinationCell.textContent = data.destination;
  timestampCell.textContent = new Date(data.timestamp).toLocaleString();
  totalOperations++;
  const processingSuccessful = true; 
  if (processingSuccessful) {
    successfulOperations++;
  }
  updateSuccessRate();
};

// Function to fetch data from the API
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/timeseries");
    if (response.ok) {
      const data = await response.json();
      const item = data[data.length - 1];
      insertRow(item);
    } else {
      console.error("Failed to fetch data from the API");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();
setInterval(fetchData, 10000);
