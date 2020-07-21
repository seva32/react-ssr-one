/* eslint-disable no-restricted-globals */
self.addEventListener('fetch', (event) => {
  if (event.request) {
    console.log(event.request.url);
  }
  return event.respondWith(fetch(event.request));
});
