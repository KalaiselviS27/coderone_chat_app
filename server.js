const WebSocket = require("ws");
const http = require("http");

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running");
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New client connected!");
  clients.add(ws);

  // Notify others about the new connection
  broadcast({ text: "A new user has joined the chat!", username: "System" }, ws);

  // Handle incoming messages
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    broadcast(msg, ws);
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("A client disconnected.");
    clients.delete(ws);
    broadcast({ text: "A user has left the chat.", username: "System" });
  });

  // Handle errors
  ws.on("error", (err) => console.error(`WebSocket error: ${err.message}`));
});

// Broadcast a message to all connected clients
function broadcast(message, sender) {
  const msgString = JSON.stringify(message);
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(msgString);
    }
  });
}

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
