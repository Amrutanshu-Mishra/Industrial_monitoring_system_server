import { WebSocketServer } from "ws";
import http from "http";
import dgram from "dgram";

const UDP_HOST = "127.0.0.1";
const UDP_PORT = 5683;

const PORT = process.env.PORT; // MUST use Render-assigned port ONLY

console.log("ENV PORT =", PORT);

// HTTP server so Render detects service
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Relay OK");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server });

console.log(`WebSocket → UDP Relay ready on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("WS → UDP:", msg.toString());

    const udp = dgram.createSocket("udp4");
    udp.send(msg, UDP_PORT, UDP_HOST, (err) => {
      if (err) console.error("UDP error:", err);
      udp.close();
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
