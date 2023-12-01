import axios from "axios";

export const checkNetWorkStatus = () => {
  return new Promise((resolve) => {
    try {
      fetch("//google.com", {
        mode: "no-cors",
        cache: "no-store",
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    } catch (error) {
      resolve(false);
    }
  });
};
