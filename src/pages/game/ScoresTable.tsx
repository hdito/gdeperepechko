import { Score } from "@/types/score";

type Props = {
  scores: Score[];
};

export const ScoresTable = ({ scores }: Props) => {
  return (
    <table>
      <thead className="bg-gray-700 text-left text-white">
        <tr>
          <th className="px-2 py-1">№</th>
          <th className="px-2 py-1">Имя</th>
          <th className="px-2 py-1">Время, c.</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => (
          <tr className="odd:bg-gray-200" key={score.uid}>
            <td className="px-2 py-1">{index + 1}</td>
            <td className="px-2 py-1">{score.name}</td>
            <td className="px-2 py-1">{score.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
