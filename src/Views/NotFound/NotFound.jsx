import React from 'react';
import { Head, Status } from '../../Components';
// eslint-disable-next-line import/no-unresolved
import imgPath from '../../assets/img/notfound.png';
import * as Styles from './NotFound.style';
import { H1 } from '../../Components/Heading/index.tsx';

const NotFound = () => (
  <>
    <Head title="Not found" />
    <Status status={404}>
      <H1>Not found</H1>
      <Styles.StyledContainer img={imgPath} />
    </Status>
  </>
);

export default NotFound;
