/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
// interceptar los req de la app solamente importando este modulo
// const oldXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function (
//   method,
//   url,
//   async,
//   user,
//   password,
// ) {
//   // do something with the method, url and etc.
//   this.addEventListener('load', function () {
//     // do something with the response text
//     console.log(`load: ${this.responseText}`);
//   });

//   // eslint-disable-next-line prefer-rest-params
//   return oldXHROpen.apply(this, arguments);
// };

// esta impl necesita mas cambios en app.js
// eslint-disable-next-line import/prefer-default-export
export default (urlmatch, callback) => {
  // eslint-disable-next-line prefer-destructuring
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener(
      'readystatechange',
      // eslint-disable-next-line consistent-return
      function () {
        if (this.responseURL.includes(urlmatch) && this.readyState === 4) {
          return callback(this);
        }
      },
      false,
    );
    // eslint-disable-next-line prefer-rest-params
    send.apply(this, arguments);
  };
};

// app.js
// import intercept from './utils/interceptor/intercept';

// const output = async (response) => {
//   console.log(response);
//   if (response.status === 401) {
//     try {
//       const res = await axios.post('/refresh-token', {
//         withCredentials: true,
//         headers: {
//           crossorigin: true,
//         },
//       });
//       console.log(res.data);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// };

// intercept('localhost', output);

// const output = (response) => {
//   document.querySelector('body').innerHTML = response.responseText;
// };

// intercept('localhost', output);
