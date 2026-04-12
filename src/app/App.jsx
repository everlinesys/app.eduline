import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect, useState } from "react";
import OfflineScreen from "../public/pages/OfflineScreen";

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  document.addEventListener("dblclick", (e) => {
    e.preventDefault();
  }, { passive: false });
  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  });
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!isOnline) {
    return <OfflineScreen onRetry={() => window.location.reload()} />;
  }
  return <RouterProvider router={router} />;
}