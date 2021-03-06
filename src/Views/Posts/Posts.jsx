/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import dompurify from 'dompurify';
import * as Styles from './Posts.style';
import { Loader, Head } from '../../Components';
import * as actionCreators from '../../store/actions';

const dataPost = require('./data-post.md');
const dataSidePost = require('./data-side-post.md');

// eslint-disable-next-line react/prop-types
const Posts = ({
  posts,
  error,
  onDataLoad,
  userData,
  userError,
  currentUser,
  onGetCurrentUser,
  onLoadUserData,
}) => {
  const sanitizer = dompurify.sanitize;

  useEffect(() => {
    let mounted = true; // eslint-disable-line
    if (!posts || posts.length < 1) {
      onDataLoad();
    }
    if (!userData || Object.keys(userData).length === 0) {
      onLoadUserData();
    }

    if (!currentUser || Object.keys(currentUser).length === 0) {
      onGetCurrentUser();
    }
    return function cleanup() {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // cuidado al agregar parametros, se va a montar con cada resultado

  return (
    <>
      <Head title="Posts" />
      <h1>Post Page</h1>
      <h2>
        Welcome {currentUser.email ? `back ${currentUser.email}!` : 'back!'}
      </h2>
      <h3>
        {Object.keys(userData).length > 0
          ? userData.seb
          : userError || 'Loading your data...'}
      </h3>
      {/* <button type="button" onClick={() => onLoadUserData()}>
        {userData}
      </button>
      {userError}
      <button type="button" onClick={() => onGetCurrentUser()}>
        {currentUser}
      </button> */}
      {posts && posts.length !== 0 ? (
        <List>
          {posts.map((post) => (
            <List.Item key={post.id}>
              <List.Header>{post.title}</List.Header>
              The lovely luck
            </List.Item>
          ))}
        </List>
      ) : (
        <Loader />
      )}
      {error && error.length !== 0 && <h4>{error}</h4>}
      <Styles.Container>
        <Styles.Card>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizer(dataPost.__content),
            }}
          />
        </Styles.Card>
        <Styles.Card>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizer(dataSidePost.__content),
            }}
          />
        </Styles.Card>
      </Styles.Container>
    </>
  );
};

Posts.propTypes = {
  posts: PropTypes.array,
  error: PropTypes.string,
  onDataLoad: PropTypes.func,
  userData: PropTypes.object,
  userError: PropTypes.string,
  currentUser: PropTypes.object,
  onGetCurrentUser: PropTypes.func,
  onLoadUserData: PropTypes.func,
};

Posts.defaultProps = {
  posts: [],
  error: '',
  onDataLoad: () => {},
  userData: {},
  userError: '',
  currentUser: {},
  onGetCurrentUser: () => {},
  onLoadUserData: () => {},
};

const mapStateToProps = ({ posts, users }) => ({
  posts: posts.list,
  error: posts.error,
  userData: users.userData,
  userError: users.error,
  currentUser: users.currentUser,
});

// onDataLoad lo voy a usar para el CSR
const mapDispatchToProps = (dispatch) => ({
  onDataLoad: () => dispatch(actionCreators.fetchPosts()),
  onGetCurrentUser: () => dispatch(actionCreators.getCurrentUser()),
  onLoadUserData: () => dispatch(actionCreators.getUserData()),
});

// funcion a usar en routes para SSR
function loadDataPosts(store) {
  return store.dispatch(actionCreators.fetchPosts());
}

export { loadDataPosts };

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
