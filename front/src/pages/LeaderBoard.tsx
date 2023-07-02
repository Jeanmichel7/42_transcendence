import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/leaderBoard';
import { UserInterface } from '../types';

const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState<UserInterface[]>([]);
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      const resFatchLeaderBoard = await getLeaderboard(page, offset);
      if ('error' in resFatchLeaderBoard) 
        return console.warn(resFatchLeaderBoard.error);
      setLeaderBoard((prev) => [...prev, ...resFatchLeaderBoard]);
    };
    fetchLeaderBoard();
  }, []);

  return (
    <>
      <h1 className="text-3xl text-center mb-5">Leaderboard</h1>
      {
        leaderBoard.map((user, index) => (
          <div key={index} className="flex justify-between">
            <p className="text-xl">{index + 1}</p>
            <p className="text-xl">{user.firstName + ' ' + user.lastName}</p>
            <p className="text-xl">{user.score.toFixed(2)}</p>
          </div>
        ))
      }
    </>
  );
};

export default LeaderBoard;