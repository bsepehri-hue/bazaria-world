import { WebSocketServer } from "ws";
import { mockDashboardData } from "./data/mockDashboardData.js";

const PORT = process.env.PORT || 4000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send initial data
  ws.send(JSON.stringify(mockDashboardData));

  // Push updates every 15s
  setInterval(() => {
    const updatedData = {
      ...mockDashboardData,
      sales: mockDashboardData.sales.map((s) => ({
        ...s,
        gross: s.gross + Math.floor(Math.random() * 500),
        net: s.net + Math.floor(Math.random() * 300),
      })),
    };
    ws.send(JSON.stringify(updatedData));
  }, 15000);
});

console.log(`WebSocket server running on port ${PORT}`);