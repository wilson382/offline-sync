/* eslint-disable  */
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

workbox.setConfig({
  debug: true,
});

const { clientsClaim } = workbox.core;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute, createHandlerBoundToURL } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkOnly, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { BackgroundSyncPlugin, Queue } = workbox.backgroundSync;

workbox.googleAnalytics.initialize();

precacheAndRoute(self.__WB_MANIFEST);

/* eslint-enable */
/* eslint-disable  no-restricted-globals */

const fileExtRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  const { pathname } = url;
  if (request.mode !== "navigate") {
    return false;
  }

  if (pathname.startsWith("/_") || pathname.match(fileExtRegexp)) {
    return false;
  }

  return true;
}, createHandlerBoundToURL("/index.html"));

registerRoute(
  new RegExp(".*.png|jpg|jpeg|svg|gif|webp"),
  new CacheFirst({
    cacheName: "images",
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 60 })],
  })
);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const queue = new Queue("bgSyncCobro", {
//   onSync: async ({ queue }) => {
//     console.log("sync flow - on custom onSync started");
//     let entry;
//     while ((entry = await queue.shiftRequest())) {
//       try {
//         const res = await fetch(entry.request.clone());
//         // const data = await res.json();
//         await delay(600);

//         if (res.status !== 200 && res.status !== 208) {
//           console.log(`sync flow - code ${res.status} fetch (queue) tried but retrying `, entry.request.url);
//           await delay(5000);
//           throw new Error("sync flow - Force retry this request.");
//         } else {
//           console.log(`sync flow - code ${res.status} fetch (queue) succeed`, entry.request.url);

//           // postSuccessMessage({
//           //   type: "BGSYNC_SUCCESS_UPDATE",
//           //   syncronization_id: data.syncronization_id,
//           // });
//         }
//       } catch (error) {
//         console.log(`sync flow - fetch (queue) failed network error will be retried`, error, entry.request.url);
//         await queue.pushRequest(entry);
//         throw error;
//       }

//       updatePendingQueues();
//     }
//   },
//   maxRetentionTime: 60 * 24 * 8,
//   maxEntries: 1000,
// });

const updatePendingQueues = async () => {
  const bgSyncQueueSize = await queue.size();

  postSuccessMessage({
    type: "BGSYNC_QUEUE_SIZE_COUNT",
    bgSyncQueueSize,
  });
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const { url, method } = request;

  //"bgsync/cobro/"
  if (method !== "POST" || url.indexOf("/disabled/using/indexDb-sync") < 0) {
    return;
  }

  const fetchOrAddToBgSync = async () => {
    try {
      const response = await fetch(request.clone());
      // const data = await response.json();

      if (response.status !== 200 && response.status !== 208) {
        console.log(`sync flow - code ${response.status} fetch (syncLogic) tried but retrying`, url);
        await delay(5000);
        throw new Error("sync flow - Force retry this request.");
      }

      console.log(`sync flow - code ${response.status} fetch (syncLogic) succeed`, url);

      // postSuccessMessage({
      //   type: "BGSYNC_SUCCESS_UPDATE",
      //   syncronization_id: data.syncronization_id,
      // });

      return response;
    } catch (error) {
      console.log(`sync flow - fetch (syncLogic) failed network error will be retried`, error, url);

      await queue.pushRequest({ request });
      updatePendingQueues();
      throw error;
    }
  };

  event.respondWith(fetchOrAddToBgSync());
});

async function postSuccessMessage(data) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    await client.postMessage(data);
  }
}

registerRoute(
  new RegExp("https://r.lr*"),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin("bgSyncLogRocket", {
        maxRetentionTime: 3 * 24 * 60,
      }),
    ],
  }),
  "POST"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/questions"),
  new CacheFirst({
    cacheName: "security-questions",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 3 * 30 * 24 * 60 * 60, //3 Months
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/debtor/loans/check/"),
  new CacheFirst({
    cacheName: "debtor-loans-check",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 10 * 24 * 60 * 60, //10 days
        maxEntries: 30,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/bank/account/information"),
  new CacheFirst({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 10 * 24 * 60 * 60, //10 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  //This strategy will match /user/*, /user/config/*
  ({ url }) => url.pathname.startsWith("/user/"),
  new NetworkFirst({
    cacheName: "cobro-caches",
    networkTimeoutSeconds: 300,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/user/route/permissions/"),
  new StaleWhileRevalidate({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 24 * 60 * 60, //60 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/debtors/"),
  new StaleWhileRevalidate({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 3,
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/route/cuadre/"),
  new NetworkFirst({
    cacheName: "cobro-caches",
    networkTimeoutSeconds: 300,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/owner/configv2/"),
  new NetworkFirst({
    cacheName: "cobro-caches",
    networkTimeoutSeconds: 300,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/debtorcedula/"),
  new StaleWhileRevalidate({
    cacheName: "cedula-datas",
    networkTimeoutSeconds: 300,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/cobro/route/"),
  new StaleWhileRevalidate({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 10 * 24 * 60 * 60, //10 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/route/info/"),
  new StaleWhileRevalidate({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 10 * 24 * 60 * 60, //10 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/customer/balance/"),
  new NetworkFirst({
    cacheName: "cobro-caches",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 20 * 24 * 60 * 60, //20 days
      }),
    ],
  }),
  "GET"
);

registerRoute(
  new RegExp("https://ipapi.co/json/"),
  new CacheFirst({
    cacheName: "client-data",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 2 * 60 * 60,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  new RegExp("https://o637002.ingest.sentry.io/*"),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin("bgSyncSentry", {
        maxRetentionTime: 3 * 24 * 60,
      }),
    ],
  }),
  "POST"
);

registerRoute(
  new RegExp("https://api.emailjs.com/api/v1.0/email/send"),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin("bgSyncSendEmail", {
        maxRetentionTime: 7 * 24 * 60,
      }),
    ],
  }),
  "POST"
);

self.addEventListener("message", async (event) => {
  if (event.data) {
    const { data } = event;
    if (data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }

    if (data.type === "getBgSyncQueueSize") {
      updatePendingQueues();
    }

    if (data.type === "registerBackgroundSync") {
      await self.registration.sync.register("workbox-background-sync:bgSyncCobro");
      queue.replayRequests();
    }
  }
});

// self.addEventListener("sync", async (event) => {});

clientsClaim();
self.skipWaiting();
