/* eslint-disable implicit-arrow-linebreak */
import styled from 'styled-components';

export const Banner = styled.div`
  position: fixed;
  display: ${({ close }) => (close ? 'none' : 'flex')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  right: 0;
  left: 0;
  height: ${({ theme, isMobile }) =>
    isMobile ? 'auto' : theme.cookieBannerHeight};
  background-color: white;
  padding: 1rem;
`;
