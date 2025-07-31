import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-hot-toast";

export default function StockNotifier() {
  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(
        `${process.env.REACT_APP_API || "http://localhost:5000"}/hubs/stock`,
      { accessTokenFactory: () => localStorage.getItem("token") || "" }
      )
      .withAutomaticReconnect()
      .build();

    conn.start();
    conn.on("lowStock", items => {
      items.forEach(i =>
        toast.error(`⚠️ ${i.name} chỉ còn ${i.qty}`));
    });
    return () => conn.stop();
  }, []);
  return null;
}
