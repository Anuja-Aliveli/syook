require('dotenv').config();
const crypto = require("crypto");
const io = require("socket.io-client");
const data = require("./data.json");

const listenerServiceUrl = "http://localhost:5000";
const socket = io(listenerServiceUrl);

const passKey = process.env.passKey;
const iv = Buffer.from(process.env.iv, 'hex'); 

// Generate a random message
const generateMessage = async () => {
  let randomName, randomOrigin, randomDestination;
  do {
    randomName = data.names[Math.floor(Math.random() * data.names.length)];
    randomOrigin = data.cities[Math.floor(Math.random() * data.cities.length)];
    randomDestination =
      data.cities[Math.floor(Math.random() * data.cities.length)];
  } while (randomOrigin === randomDestination);

  const randomMessage = {
    name: randomName,
    origin: randomOrigin,
    destination: randomDestination,
  };

  const secretKey = await crypto
    .createHash("sha256")
    .update(JSON.stringify(randomMessage))
    .digest("hex");
  randomMessage.secretKey = secretKey;
  return randomMessage;
};

// Encrypt message using AES-256-CTR
const encryptMessage = async (message) => {
  const cipher = await crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(passKey, 'hex'),
    iv
  );
  const encryptedMessage =
    await cipher.update(JSON.stringify(message), "utf8", "hex") + cipher.final("hex");
  return encryptedMessage;
};

setInterval(async () => { 
  try {
    const message = await generateMessage(); 
    const encryptedMessage = await encryptMessage(message); 
    socket.emit("message", encryptedMessage);
    console.log("Message emitted:", message);
  } catch (error) {
    console.error("Error:", error);
  }
}, 10000);
