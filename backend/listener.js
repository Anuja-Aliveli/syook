require("dotenv").config();
const { io } = require("./server");
const crypto = require("crypto");

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
