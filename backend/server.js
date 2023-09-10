require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

let db = null;
let messagesCollection = null;

const initializeAndConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(MONGODB_URI, dbOptions);
    db = mongoose.connection;
    messagesCollection = db.collection("messages");
    if (db.readyState === 1) {
      console.log("Mongoose Connected");
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
      });
    } else {
      console.log("MongoDB connection failed or pending.");
    }
  } catch (err) {
    console.log(`Db err ${err}`);
    process.exit(1);
  }
};

initializeAndConnect();

module.exports = { db, messagesCollection, app };
