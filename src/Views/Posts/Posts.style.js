import styled from 'styled-components';

export const StyledButton = styled('button')`
  color: ${({ theme }) => theme.socialMediaIconColor};
  background-color: yellow;
`;

export const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Card = styled.div`
  width: 50%;
  height: 100%;
  align-self: center;
  background-color: blueviolet;
`;
