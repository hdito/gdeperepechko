import { styled } from "@linaria/react";

export const Button = styled.button`
  font: inherit;
  padding: 0.25rem 0.5rem;
  background: black;
  color: white;
  border: none;
  border-radius: 0.3rem;
  trnasition: all 0.5s;
  &:hover {
    background: hsl(0, 0%, 30%);
    box-shadow: 0 0 0.1rem hsl(0, 0%, 20%);
  }
  &:active {
    background: hsl(0, 0%, 30%);
    box-shadow: 0 0 0.1rem hsl(0, 0%, 20%);
  }
`;
