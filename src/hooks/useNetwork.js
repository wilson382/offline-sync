import { useEffect, useState } from "react";

export default function useNetwork() {
  const [isOnline, setNetwork] = useState(true);

  const updateNetwork = () => {
    const condition = window.navigator.onLine;

    if (condition === true) {
      const webPing = setInterval(() => {
        fetch("//google.com", {
          mode: "no-cors",
          cache: "no-store",
        })
          .then(() => {
            setNetwork(true);
            return clearInterval(webPing);
          })
          .catch(() => setNetwork(false));
      }, 3000);
      return;
    }

    setNetwork(false);
  };

  useEffect(() => {
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);
    return () => {
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("online", updateNetwork);
    };
  });
  return isOnline;
}
