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
  Filler,
} from 'chart.js';

Chart.register(
  Filler,
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
  const [scorePlayer, setScorePlayer] = useState<number[]>([]);
  const [gamesWin, setGamesWin] = useState<number>(0);
  const [ratio, setRatio] = useState<string>('0');
  const [niveau, setNiveau] = useState<number[]>([]);
  const [exp, setExp] = useState<number[]>([]);

  useEffect(() => {
    if (!user.id || !games) return;

    setScorePlayer([
      1500,
      ...games
        .map(game =>
          game.player1.id === user.id
            ? game.eloScorePlayer1
            : game.eloScorePlayer2,
        )
        .reverse(),
    ]);
    setGamesWin(games.filter(g => g.winner?.id === user.id).length);
    setRatio(((gamesWin / games.length) * 100).toFixed(1));
    setNiveau([
      1,
      ...games
        .map(g => (g.player1.id === user.id ? g.levelPlayer1 : g.levelPlayer2))
        .reverse(),
    ]);
    setExp([
      0,
      ...games
        .map(g => (g.player1.id === user.id ? g.expPlayer1 : g.expPlayer2))
        .reverse(),
    ]);
  }, [user.id, games, gamesWin]);

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
        <Sticker dataText="Stats" />
      </p>
      {games && games.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* ELO SCORE CHART */}
          <div className="relative w-full md:w-[35vw] px-16 py-8 md:p-2">
            <p className="text-center text-xl font-semibold mb-4">Elo score</p>
            <Line
              datasetIdKey="id"
              data={{
                labels: Array.from(Array(games.length + 1).keys()).map(i => i),
                datasets: [
                  {
                    data: scorePlayer,
                    label: 'Elo score',
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#3498db',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                interaction: {
                  mode: 'nearest',
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
                plugins: {
                  title: {
                    // display: true,
                    text: 'Elo Score',
                    font: {
                      size: 20,
                    },
                  },
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
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          </div>

          {/* LEVEL - EXPERIENCE CHART */}
          <div className="relative w-full md:w-[35vw] px-16 py-8 md:p-2">
            <p className="text-center text-xl font-semibold mb-4">
              Level - Experience
            </p>
            <Line
              datasetIdKey="id2"
              data={{
                labels: Array.from(Array(games.length + 1).keys()).map(i => i),
                datasets: [
                  {
                    label: 'Level',
                    data: niveau,
                    yAxisID: 'y-axis-xp',
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#3498db',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    tension: 0.2,
                  },
                  {
                    label: 'Experience',
                    data: exp,
                    yAxisID: 'y-axis-level',
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                    pointBorderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2,
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#e74c3c',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    fill: true,
                    tension: 0.05,
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
                    title: {
                      display: true,
                      text: 'Level',
                    },
                    grid: {
                      color: 'rgba(52, 152, 219, 0.4)',
                    },
                    ticks: {
                      stepSize: 1,
                      precision: 0,
                    },
                  },
                  'y-axis-level': {
                    type: 'linear',
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Experience',
                    },
                    grid: {
                      color: 'rgba(231, 76, 60, 0.4)',
                    },
                    ticks: {
                      stepSize: 10,
                      precision: 0,
                    },
                  },
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
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
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                  },
                },
              }}
            />
          </div>

          {/* VICTORY RATIO PIE CHART */}
          <div className="relative w-full md:w-[20vw] px-48 py-8 md:p-2">
            <p className="text-center text-xl font-semibold mb-4">
              {ratio} % Victory
            </p>
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
                      boxWidth: 40,
                      boxHeight: 600,
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
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
