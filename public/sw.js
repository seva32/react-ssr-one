/* eslint-disable func-names */
/* eslint-disable wrap-iife */
/* eslint-disable no-restricted-globals */

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
// self.addEventListener('install', (event) => {
//   event.waitUntil(self.clients.claim());
// });

self.addEventListener('fetch', (event) => {
  // event.waitUntil(
  //   (async function () {
  //     // Exit early if we don't have access to the client.
  //     // Eg, if it's cross-origin.
  //     console.log('event::::::::::', event);
  //     if (!event.clientId) return;

  //     // Get the client.
  //     const client = await clients.get(event.clientId); // eslint-disable-line
  //     // Exit early if we don't get the client.
  //     // Eg, if it closed.
  //     if (!client) return;

  //     // Send a message to the client.
  //     client.postMessage({
  //       msg: 'Hey I just got a fetch from you!',
  //       url: event.request.url,
  //     });
  //   })(),
  // );
  if (/users$/.test(event.request.url)) {
    // event.respondWith(
    //   new Response(
    //     '<p>This is a response that comes from your service worker!</p>',
    //     {
    //       headers: { 'Content-Type': 'text/html' },
    //     },
    //   ),
    // );
    let supportsWebp = false;
    if (event.request.headers.has('accept')) {
      supportsWebp = event.request.headers.get('accept').includes('webp');
    }

    if (supportsWebp) {
      const req = event.request.clone();

      // const returnUrl = `${req.url}.webp`;

      event.respondWith(
        // fetch(returnUrl, {
        //   mode: 'no-cors',
        // }),
        // new Response(`<p>${returnUrl}!</p>`, {
        //   headers: { 'Content-Type': 'text/html' },
        // }),
        fetch(req),
      );
    }
  }

  // si server envia el header save-data uso recursos mas livianos
  // if (event.request.headers.get('save-data')) {
  //   // We want to save data, so restrict icons and fonts
  //   if (event.request.url.includes('fonts.googleapis.com')) {
  //     // return nothing
  //     event.respondWith(
  //       new Response('', {
  //         status: 417,
  //         statusText: 'Ignore fonts to save data.',
  //       }),
  //     );
  //   }
  // }
});

// in client
// navigator.serviceWorker.addEventListener('message', (event) => {
//   console.log(event.data.msg, event.data.url);
// });
