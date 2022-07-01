import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { Button } from "./Button";
interface IScore {
  name: string;
  time: number;
  id: string;
}
interface IPrintedScore {
  name: string;
  id: string;
  time: string;
  index: number | string;
}

const ScoreboardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1rem 2rem;
  border-radius: 1rem;
  background: gold;
  transform: translate(-50%, -50%);
`;
const Input = styled.input`
  background: transparent;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-bottom: 1px solid hsl(0, 0%, 20%);
`;
const FlexContainer = styled.div`
  display: flex;
  gap: 0.2rem;
  align-items: center;
`;
const active = css`
  font-weight: bolder;
`;
export const Scoreboard = ({ time }: { time: number }) => {
  const id = useRef(nanoid());
  const [scores, setScores] = useState<IScore[]>(
    JSON.parse(sessionStorage?.scores ?? "[]")
  );
  const [inputName, setInputName] = useState("");
  const [showInput, setShowInput] = useState(true);
  let printedScores: IPrintedScore[] = [];
  if (scores.length > 10) {
    const index = scores.findIndex((score) => score.id === id.current);
    if (index > 9) {
      printedScores = scores.slice(0, 7).map((score, index) => {
        return {
          index: (index + 1).toString(),
          name: score.name,
          id: score.id,
          time: score.time.toString(),
        };
      });
      printedScores.push({ index: "...", name: "...", id: "...", time: "..." });
      printedScores.push({
        index: index - 1,
        name: scores[index - 1].name,
        id: scores[index - 1].id,
        time: scores[index - 1].time.toString(),
      });
      printedScores.push({
        index: index,
        name: scores[index].name,
        id: scores[index].id,
        time: scores[index].time.toString(),
      });
    } else {
      printedScores = scores.slice(0, 10).map((score, index) => {
        return {
          index: (index + 1).toString(),
          name: score.name,
          id: score.id,
          time: score.time.toString(),
        };
      });
    }
  } else {
    printedScores = scores.slice(0, 10).map((score, index) => {
      return {
        index: (index + 1).toString(),
        name: score.name,
        id: score.id,
        time: score.time.toString(),
      };
    });
  }
  console.log({ printedScores });
  console.log({ scores });
  const handleAdd = () => {
    if (inputName === "") return;
    const newScores = [...scores, { name: inputName, time, id: id.current }];
    newScores.sort((score1, score2) => score1.time - score2.time);
    sessionStorage.scores = JSON.stringify(newScores);
    setScores(newScores);
    setInputName("");
    setShowInput(false);
  };
  return (
    <ScoreboardContainer>
      <h2>
        Ты нашёл Перепечко за {(Math.floor(time / 100) / 10).toString()} c.
      </h2>

      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Имя</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          {printedScores.map((score) => (
            <tr
              className={score.id === id.current ? active : ""}
              key={score.id}
            >
              <td>{score.index}</td>
              <td>{score.name}</td>
              <td>{score.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScoreboardContainer>
  );
};
