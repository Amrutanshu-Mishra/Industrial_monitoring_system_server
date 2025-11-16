import WebSocket, { WebSocketServer } from "ws";
import dgram from "dgram";

const UDP_HOST = "127.0.0.1";
const UDP_PORT = 5683;

const wss = new WebSocketServer({ port: process.env.PORT || 10000 });

console.log("WebSocket -> UDP Relay running");

wss.on("connection", function (ws) {
  console.log("Client connected");

  ws.on("message", function (msg) {
    console.log("WS → UDP:", msg.toString());

    const udp = dgram.createSocket("udp4");
    udp.send(msg, UDP_PORT, UDP_HOST, (err) => {
      if (err) console.error("UDP Send Error:", err);
      udp.close();
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});
