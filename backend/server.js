require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

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
      io.emit("dbConnected");
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

// Socket

io.on("connection", (socket) => {
  console.log("Emitter connected");
  socket.on("message", (encryptedMessage) => {
    const passKey = process.env.passKey;
    const iv = Buffer.from(process.env.iv, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      Buffer.from(passKey, "hex"),
      iv
    );
    let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf8");
    decryptedMessage += decipher.final("utf8");

    try {
      const message = JSON.parse(decryptedMessage);

      const secretKey = crypto
        .createHash("sha256")
        .update(
          JSON.stringify({
            name: message.name,
            origin: message.origin,
            destination: message.destination,
          })
        )
        .digest("hex");

      if (secretKey === message.secretKey) {
        console.log("Received Valid Data:", message);
        const timestamp = new Date();
        message.timestamp = timestamp;
        messagesCollection.insertOne(message, (err, result) => {
          if (err) {
            console.error("Error inserting message into the database:", err);
          } else {
            console.log("Message inserted into the database:", result);
            io.emit("dataUpdate", message);            
          }
        });
      } else {
        console.log("Invalid Data: Secret key mismatch");
      }
    } catch (error) {
      console.error("Error processing data:", error.message);
    }
  });
});

// API frontend
app.get("/timeseries", async (req, res) => {
  try {
    const timeSeriesData = await messagesCollection.find().toArray();
    res.json(timeSeriesData);
  } catch (error) {
    console.error("Error fetching time-series data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { db, messagesCollection, io, app };
