import { styled } from "@linaria/react";

export const Button = styled.button`
  font: inherit;
  padding: 0.25em 0.5em;
  background: black;
  color: white;
  border: none;
  border-radius: 0.3em;
  transition: all 0.1s;
  &:hover {
    opacity: 0.7;
  }
`;
