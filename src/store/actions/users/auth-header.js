// export default function authHeader() {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (user && user.accessToken) {
//     return { Authorization: `Bearer ${user.accessToken}` };
//   }
//   return {};
// }

// para express usar x-access-token
export default () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    // for Node.js Express back-end
    return { 'x-access-token': user.accessToken };
  }
  return {};
};
