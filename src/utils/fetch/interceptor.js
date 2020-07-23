/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios';
// import createAuthRefreshInterceptor from 'axios-auth-refresh';

// const instance = axios.create({
//   baseURL: process.env.REACT_APP_API || 'localhost',
//   headers: {
//     'content-type': 'application/json',
//   },
//   responseType: 'json',
// });
// const refreshAuthLogic = (failedRequest) =>
//   instance
//     .post('token/refresh/', {
//       refresh: localStorage.getItem('user.refreshToken'),
//     })
//     .then((tokenRefreshResponse) => {
//       localStorage.setItem(
//         'user.accessToken',
//         tokenRefreshResponse.data.access,
//       );
//       failedRequest.response.config.headers[
//         'x-access-token'
//       ] = `${tokenRefreshResponse.data.access}`;
//       return Promise.resolve();
//     })
//     .catch((error) => {
//       console.log('refresh fail');
//       localStorage.setItem('user.accessToken', null);
//       localStorage.setItem('user.refreshToken', null);
//       // pushToLogin();
//       return Promise.reject(error);
//     });
// createAuthRefreshInterceptor(instance, refreshAuthLogic);

// export default instance;

export default class authService {
  init = () => {
    this.setInterceptors();
  };

  setInterceptors = () => {
    axios.defaults.headers.common['x-access-token'] = localStorage.getItem(
      'user.accessToken',
    );
    axios.defaults.headers.common.Device = 'device';

    axios.interceptors.response.use(
      (response) => response,
      (err) =>
        new Promise((resolve, _reject) => {
          const originalReq = err.config;
          if (
            err.response.status === 401 &&
            err.config &&
            // eslint-disable-next-line no-underscore-dangle
            !err.config.__isRetryRequest
          ) {
            // eslint-disable-next-line no-underscore-dangle
            originalReq._retry = true;

            const res = fetch('http://localhost:8080/api/v1/auth/refresh', {
              method: 'POST',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json',
                Device: 'device',
                Token: localStorage.getItem('token'),
              },
              redirect: 'follow',
              referrer: 'no-referrer',
              body: JSON.stringify({
                token: localStorage.getItem('token'),
                refresh_token: localStorage.getItem('refresh_token'),
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                this.setSession({
                  token: res.token,
                  refresh_token: res.refresh,
                });
                originalReq.headers.Token = res.token;
                originalReq.headers.Device = 'device';

                return axios(originalReq);
              });

            resolve(res);
          }

          return Promise.reject(err);
        }),
    );
  };
}
