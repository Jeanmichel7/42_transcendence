import { useEffect, useState } from 'react';
import { Sticker } from '../../utils/StyledTitle';
import { UserInterface } from '../../types';
import { GameInterface } from '../../types/GameTypes';

import { Line, Pie } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
} from 'chart.js';

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
);

interface PropsGames {
  user: UserInterface;
  games: GameInterface[];
}

export default function StatsGame({ user, games }: PropsGames) {
  const [gamesFinished, setGamesFinished] = useState<GameInterface[]>([]);
  const [scorePlayer, setScorePlayer] = useState<number[]>([]);
  const [gamesWin, setGamesWin] = useState<number>(0);
  const ratio = ((gamesWin / gamesFinished.length) * 100).toFixed(1);
  const niveau = [
    1,
    ...gamesFinished
      .map(g => (g.player1.id === user.id ? g.levelPlayer1 : g.levelPlayer2))
      .reverse(),
  ];
  const exp = [
    0,
    ...gamesFinished
      .map(g => (g.player1.id === user.id ? g.expPlayer1 : g.expPlayer2))
      .reverse(),
  ];

  useEffect(() => {
    setGamesFinished(games.filter(g => g.status === 'finished'));
  }, [games]);

  useEffect(() => {
    setScorePlayer([
      1500,
      ...gamesFinished
        .map(game =>
          game.player1.id === user.id
            ? game.eloScorePlayer1
            : game.eloScorePlayer2,
        )
        .reverse(),
    ]);
    setGamesWin(gamesFinished.filter(g => g.winner?.id === user.id).length);
  }, [gamesFinished, user.id]);

  const pieData = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        data: [
          gamesWin,
          games.filter(g => g.status === 'finished').length - gamesWin,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <p className="mt-6">
        {' '}
        <Sticker dataText="Stats" />{' '}
      </p>
      {games && games.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="relative w-full md:w-[35vw] px-16 py-8 md:p-2">
            <p className="text-center">Elo score</p>
            <Line
              datasetIdKey="id"
              data={{
                labels: Array.from(Array(games.length + 1).keys()).map(i => i),
                datasets: [
                  {
                    data: scorePlayer,
                    label: 'Elo score',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                },
                scales: {},
                plugins: {
                  legend: {
                    display: true,
                    position: 'left',
                    labels: {
                      color: 'black',
                      font: {
                        size: 12,
                      },
                      boxWidth: 20,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="relative w-full md:w-[35vw] px-16 py-8 md:p-2">
            <p className="text-center">Level - Experience</p>
            <Line
              datasetIdKey="id2"
              data={{
                labels: Array.from(Array(games.length + 1).keys()).map(i => i),
                datasets: [
                  {
                    label: 'Level',
                    data: niveau,
                    yAxisID: 'y-axis-xp',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Experience',
                    data: exp,
                    yAxisID: 'y-axis-level',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                },
                scales: {
                  'y-axis-xp': {
                    type: 'linear',
                    position: 'left',
                  },
                  'y-axis-level': {
                    type: 'linear',
                    position: 'right',
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: 'black',
                      font: {
                        size: 12,
                      },
                      boxWidth: 20,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="relative w-full md:w-[20vw] px-48 py-8 md:p-2">
            <p className="text-center">{ratio} % Victory</p>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: 'black',
                      font: {
                        size: 12,
                      },
                      boxWidth: 200,
                      boxHeight: 20,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
