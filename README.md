# Syook Assignment
# Time-Series Data Project

-This project is a simple example of a web application for displaying and updating time-series data in real-time. 
-It consists of a frontend and a backend component. 
-The backend has 2 services emitter and listener services.
-Emitter service generates random messages which contain name, origin, destination. It also generates secret key and encrypts it and send to listner via socket.
-Listener service listens to these messages and decryts it. If it matches with original it inserts into mongodb else discards.
-The frontend displays this data in a table format by making api call to server for every 10 secs.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)

## Technologies Used

- Frontend:
  - HTML, CSS
  - JavaScript
  - Fetch API for data retrieval
- Backend:
  - Node.js with Express.js
  - MongoDB for data storage
  - Socket.io for real-time data updates
  - Crypto for data encryption

## Project Structure

- `frontend/`: Contains the frontend code (HTML, CSS, JavaScript).
- `backend/`: Contains the backend code (Node.js, Express.js, MongoDB).
- `server.js`: Entry point for the backend server.
- `index.html`: HTML file for the frontend.
- `index.css`: CSS styles for the frontend.
- `index.js`: JavaScript code for the frontend.
- `README.md`: This README file.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm (Node Package Manager) installed on your machine.
- MongoDB installed and running locally, or you can use a remote MongoDB instance.

### Installation
- Frontend npm install
- backend npm install

### Running
-cd backend
-In one terminal node emitter.js
-In other terminal node server.js
-cd frontend
-npm start
-open browser and see data

### usage
- running the application, the frontend will display a table showing time-series data. The backend will insert data into the database every 10 seconds.
-The "Success Rate" is displayed at the top of the frontend, showing the percentage of successful data insertions.
-Data is fetched from the backend API and displayed in real-time.
-You can customize the frontend and backend to fit your specific requirements.
