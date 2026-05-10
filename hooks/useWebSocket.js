import { useEffect, useRef } from "react";
import { useDashboardStore } from "./useDashboardStore";

// WebSocket hook for ListToBid dashboard
export function useWebSocket(url) {
  const wsRef = useRef(null);
  const { addMerchant, updateStorefront, closeAuction } = useDashboardStore();

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const ts = data.lastUpdated;

        switch (data.type) {
          case "merchant_signup":
            addMerchant(data.merchant, ts);
            break;
          case "storefront_update":
            updateStorefront(data.storefront, ts);
            break;
          case "auction_close":
            closeAuction(data.auction, ts);
            break;
          default:
            console.log("Dashboard update:", data);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [url, addMerchant, updateStorefront, closeAuction]);
}