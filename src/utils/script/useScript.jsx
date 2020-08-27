import { useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
const useScript = (url, position, async, instance) => {
  useEffect(() => {
    const placement = document.querySelector(position);
    const script = document.createElement('script');

    script.src = url;
    script.async = typeof async === 'undefined' ? true : async;

    placement.appendChild(script);
    instance = true; // eslint-disable-line

    return () => {
      placement.removeChild(script);
    };
  });
};

export default useScript;
