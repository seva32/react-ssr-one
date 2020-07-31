// /* eslint-disable indent */
// import React, { useEffect } from 'react';
// import { withRouter } from 'react-router-dom';
// // import axios from 'axios';

// // import fetchIntercept from 'fetch-intercept';

// export default (Wrapped) => {
//   function CheckRequests(props) {
//     useEffect(() => {
//       //   axios.interceptors.response.use(
//       //     (response) =>
//       //       // Do something with response data
//       //       // eslint-disable-next-line implicit-arrow-linebreak
//       //       console.log(response.data),
//       //     (error) => {
//       //       const {
//       //         // eslint-disable-next-line react/prop-types
//       //         history: { push },
//       //       } = props;
//       //       switch (error.response.status) {
//       //         case 404:
//       //         case 400:
//       //         case 401:
//       //           console.log(error);
//       //           push('/login'); // will redirect user to login page
//       //           break;
//       //         default:
//       //           break;
//       //       }
//       //       // Do something with response error
//       //       return Promise.reject(error);
//       //     },
//       //   );

//       // eslint-disable-next-line no-unused-vars
//       const unregister = fetchIntercept.register({
//         request(url, config) {
//           // Modify the url or config here
//           console.log('req::::', config);
//           return [url, config];
//         },

//         requestError(error) {
//           // Called when an error occured during another 'request' interceptor call
//           console.log('reqerr::::', error);
//           return Promise.reject(error);
//         },

//         response(response) {
//           // Modify the reponse object
//           console.log('res::::', response);
//           return response;
//         },

//         responseError(error) {
//           // Handle an fetch error
//           console.log('res::::', error);
//           return Promise.reject(error);
//         },
//       });

//       //   return () => {
//       //     unregister();
//       //   };
//     });

//     return <Wrapped {...props} />;
//   }
//   return withRouter(CheckRequests);
// };
