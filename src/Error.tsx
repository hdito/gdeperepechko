import { styled } from "@linaria/react";

const ErrorContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  background-color: hsl(0, 100%, 40%);
  border-radius: 0.5rem;
`;

const ErrorHeader = styled.h2`
  font-weight: bold;
  font-size: 1.25rem;
`;

export const Error = () => {
  return (
    <ErrorContainer>
      <ErrorHeader>Возникла ошибка</ErrorHeader>
      <p>
        Обновите вкладку. Если приложение по-прежнему не работает, попробуйте
        зайти позже
      </p>
    </ErrorContainer>
  );
};
