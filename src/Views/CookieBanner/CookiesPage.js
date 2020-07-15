/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-console */
// import React from "react";
// import { useCookies } from "react-cookie";

// function CookiesPage() {
//   const [cookies, setCookie, removeCookie] = useCookies(["seb"]);
//   return (
//     <>
//       {cookies.seb && <h1>Hello {cookies.seb}!</h1>}
//       <button
//         aria-label="ctx test"
//         id="button-id-ctx"
//         type="button"
//         onClick={() => setCookie("seb", "Fio", { path: "/", maxAge: 20 })}
//       >
//         Cookies
//       </button>
//       <button
//         aria-label="cookie test"
//         id="button-id"
//         type="button"
//         onClick={() => removeCookie("seb")}
//       >
//         Remove
//       </button>
//       <button type="button" onClick={() => console.log(cookies)}>
//         Log
//       </button>
//     </>
//   );
// }

// export default CookiesPage;

// puedo usar cookies en otro componente haciendo:
// import { withCookies } from 'react-cookie';
// const comp = (props) => {
//     {props.cookies.get('seb')}
// }
// export default withCookies(comp);

// para usar redux y formik con react-cookie
// const handleSubmit = (values, { props = this.props, setSubmitting }) => {
//    //handle form submission
//    ...
//    //set cookie
//    props.cookies.set('name', values.name, { path: '/' });

//    setSubmitting(false);

//    //update state, do something else...
//    props.handleStateFromRedux(Object.assign({}, values));
// }

// <Formik
//    onSubmit={handleSubmit}
//    ...
// />
