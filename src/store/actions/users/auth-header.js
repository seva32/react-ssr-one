// export default function authHeader() {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (user && user.accessToken) {
//     return { Authorization: `Bearer ${user.accessToken}` };
//   }
//   return {};
// }

// para express usar X-Access-Token
export default () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    // for Node.js Express back-end
    return { 'X-Access-Token': user.accessToken };
  }
  return {};
};
