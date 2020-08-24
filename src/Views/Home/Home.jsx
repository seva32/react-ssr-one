/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import { FormUI, Head } from '../../Components';
import * as Styles from './Home.style';
import './home.css';

// eslint-disable-next-line react/prop-types
const Home = () => (
  <>
    <Head title="Home" />
    <h1 className="gro">Home Scr</h1>
    <Styles.StyledContainer>
      <FormUI />
    </Styles.StyledContainer>
  </>
);

export default Home;
