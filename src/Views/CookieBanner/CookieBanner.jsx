import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Banner } from './CookieBanner.styles';

function CookieBanner(props) {
  const [close, setClose] = useState(false);
  const [widthScreen, setWidthScreen] = useState(1000);
  const [cookies, setCookie, removeCookie] = useCookies(['cookies-consent']);
  const [hasStorage, setHasStorage] = useState(
    cookies['cookies-consent'] && cookies['cookies-consent'] !== '',
  );

  const consentAction = (accept) => {
    setClose(true);
    if (accept) {
      setCookie('cookies-consent', 'accept', { path: '/' });
      setHasStorage(true);
    } else {
      removeCookie('cookies-consent');
    }
  };

  useEffect(() => {
    setWidthScreen(document.body.clientWidth);
  }, []);

  if (hasStorage) {
    return null;
  }

  const { children } = props;
  const isMobile = widthScreen < 580;

  return (
    <Banner close={close} isMobile={isMobile}>
      {children}
      <Button
        onClick={() => consentAction(true)}
        style={{ margin: 'auto 1rem auto auto' }}
      >
        Accept
      </Button>
      <Button
        onClick={() => consentAction(false)}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          border: 'none',
          background: 'transparent',
          color: 'black',
          padding: '0 6px 0 0',
        }}
      >
        x
      </Button>
    </Banner>
  );
}

CookieBanner.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};

CookieBanner.defaultProps = {
  children:
    // eslint-disable-next-line max-len
    'This website uses cookies to improve service, for analytical and advertising purposes.',
};

export default CookieBanner;
