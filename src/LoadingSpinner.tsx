import { styled } from "@linaria/react";

const Spinner = styled.div`
  width: 10vmin;
  height: 10vmin;
  border: 0.5rem solid hsl(0, 0%, 30%);
  border-top: 0.5rem solid transparent;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
export const LoadingSpinner = () => {
  return (
    <Center>
      <Spinner />
    </Center>
  );
};
