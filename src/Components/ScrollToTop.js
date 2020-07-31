// import { useEffect } from 'react';
// import { withRouter } from 'react-router-dom';

// function ScrollToTop({ history }) {
//   useEffect(() => {
//     const unlisten = history.listen(() => {
//       window.scrollTo(0, 0);
//     });
//     return () => {
//       unlisten();
//     };
//   }, [history]);

//   return null;
// }

// export default withRouter(ScrollToTop);

import { useLayoutEffect } from 'react';

const ScrollToTop = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;
