import React from 'react';
import universal from 'react-universal-component';
import { Route, Switch } from 'react-router';
import { RedirectWithStatus, Loader } from '../Components';

import '../assets/css/styles.css';
import { loadDataPosts } from '../Views/Posts/Posts';
import Layout from '../Views/Layout';

const UniversalComponent = universal(
  (props) => import(`../Views/${props.page}`),
  {
    loading: () => <Loader />,
    ignoreBabelRename: true,
  },
);

export const routes = [
  {
    exact: true,
    path: '/',
    page: 'Home',
  },
  {
    loadData: loadDataPosts,
    exact: true,
    path: '/posts',
    page: 'Posts',
  },
];

export default (
  { staticContext, lang }, // eslint-disable-line
) => (
  <Layout>
    <Switch>
      {routes.map((route) => (
        <Route
          key={route.path}
          render={(routeProps) => (
            <UniversalComponent page={route.page} {...routeProps} />
          )}
          {...route}
        />
      ))}
      <RedirectWithStatus status={301} exact from="/" to={`/${lang}`} />
      <Route
        render={(routeProps) => (
          <UniversalComponent page="NotFound" {...routeProps} />
        )}
      />
    </Switch>
  </Layout>
);

// export const routes = [
//   {
//     exact: true,
//     path: `/:lang(${availableLangs})`,
//     page: 'Home',
//   },
//   {
//     exact: true,
//     path: `/:lang(${availableLangs})/about`,
//     page: 'About',
//   },
//   {
//     loadData,
//     exact: true,
//     path: `/:lang(${availableLangs})/redux-store`,
//     page: 'ReduxPage',
//   },
//   {
//     loadData: loadDataPosts,
//     exact: true,
//     path: '/post',
//     page: 'Post',
//   },
// ];
