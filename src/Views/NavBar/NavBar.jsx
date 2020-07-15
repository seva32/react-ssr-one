/* eslint-disable react/require-default-props */

import React, { useState } from 'react';
import {
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
} from 'semantic-ui-react';
// import MobileDetect from 'mobile-detect';
import map from 'lodash.map';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible,
}) => (
  <Sidebar.Pushable>
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={visible}
    >
      {map(leftItems, (item) => (
        <Menu.Item as={NavLink} exact {...item} />
      ))}
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: '100vh' }}
    >
      <Menu fixed="top" inverted>
        <Menu.Item>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Menu position="right">
          {map(rightItems, (item) => (
            <Menu.Item as={NavLink} exact {...item} />
          ))}
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

NavBarMobile.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  leftItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  rightItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  visible: PropTypes.bool,
  onPusherClick: PropTypes.func,
  onToggle: PropTypes.func,
};

const NavBarDesktop = ({ leftItems, rightItems }) => (
  <Menu fixed="top" inverted>
    <Menu.Item>
      <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
    </Menu.Item>
    {map(leftItems, (item) => (
      <Menu.Item as={NavLink} exact {...item} />
    ))}
    <Menu.Menu position="right">
      {map(rightItems, (item) => (
        <Menu.Item as={NavLink} exact {...item} />
      ))}
    </Menu.Menu>
  </Menu>
);

NavBarDesktop.propTypes = {
  leftItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  rightItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
};

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: '5em' }}>{children}</Container>
);

NavBarChildren.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

// const getWidthFactory = isMobileFromSSR => () => {
//   const isSSR = typeof window === "undefined";
//   const ssrValue = isMobileFromSSR
//     ? Responsive.onlyMobile.maxWidth
//     : Responsive.onlyTablet.minWidth;

//   return isSSR ? ssrValue : window.innerWidth;
// };

const NavBar = ({ children, leftItems, rightItems }) => {
  const [visible, setVisible] = useState(false);

  const handlePusher = () => {
    if (visible) {
      setVisible(false);
    }
  };

  const handleToggle = () => setVisible(!visible);

  return (
    <Container>
      {/* prettier-ignore */}
      <Responsive
        fireOnMount
        getWidth={() => (typeof window === 'undefined' ? 768 : window.innerWidth)}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <NavBarMobile
          leftItems={leftItems}
          onPusherClick={handlePusher}
          onToggle={handleToggle}
          rightItems={rightItems}
          visible={visible}
        >
          <NavBarChildren>{children}</NavBarChildren>
        </NavBarMobile>
      </Responsive>
      {/* prettier-ignore */}
      <Responsive
        fireOnMount
        getWidth={() => (typeof window === 'undefined' ? 768 : window.innerWidth)}
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
        <NavBarChildren>{children}</NavBarChildren>
      </Responsive>
    </Container>
  );
};

NavBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  leftItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
  rightItems: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      content: PropTypes.string,
      key: PropTypes.string,
    }),
  ),
};

export default NavBar;
