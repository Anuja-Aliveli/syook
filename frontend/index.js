let successfulOperations = 0;
let totalOperations = 0;

// Function to update the UI with success rate
const updateSuccessRate = () => {
  const successRate = (successfulOperations / totalOperations) * 100;
  // Update your UI element with the success rate (e.g., a <div> or <span>)
  const successRateElement = document.getElementById("success-rate");
  successRateElement.textContent = `Success Rate: ${successRate.toFixed(2)}%`;
};

// Function to insert rows into the data table
const insertRow = (data) => {
  // Replace with your UI update logic
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

  // Increment the total operations counter
  totalOperations++;

  // Check if the data processing was successful (you can modify this condition)
  const processingSuccessful = true; // Replace with your condition
  if (processingSuccessful) {
    successfulOperations++;
  }

  // Update the success rate in the UI
  updateSuccessRate();
};

// Function to fetch data from the API
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/timeseries"); // Replace with your API endpoint
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

// Fetch data initially
fetchData();

// Fetch data every 10 seconds
setInterval(fetchData, 10000);
