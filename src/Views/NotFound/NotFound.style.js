/* eslint-disable arrow-parens */
import styled from 'styled-components';

export const StyledContainer = styled('div')`
  background-image: url(${(props) => props.img});
  background-size: 400px 400px;
  width: 100vw;
  height: 100vh;
`;
