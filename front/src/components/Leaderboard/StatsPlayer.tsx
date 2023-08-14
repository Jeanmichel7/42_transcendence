import { useEffect, useState } from 'react';
import { UserInterface } from '../../types';
import { Line } from 'react-chartjs-2';
import {
  ArcElement,
  CategoryScale,
  Chart,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';
import { useDispatch } from 'react-redux';
import { getHistoryGames } from '../../api/game';
import { setErrorSnackbar } from '../../store/snackbarSlice';

Chart.register(
  Filler,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
);

interface StatsPlayerProps {
  user: UserInterface;
}

const StatsPlayerChart = ({ user }: StatsPlayerProps) => {
  const [scoreData, setScoreData] = useState<number[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchGames() {
      if (!user.id) return;

      const gamesFetched = await getHistoryGames(user.id);
      if ('error' in gamesFetched)
        return dispatch(setErrorSnackbar(gamesFetched));

      setScoreData([
        1500,
        ...gamesFetched
          .map(game =>
            game.player1.id === user.id
              ? game.eloScorePlayer1
              : game.eloScorePlayer2,
          )
          .reverse(),
      ]);
    }
    fetchGames();
  }, [dispatch, user.id]);

  return (
    <>
      <Line
        datasetIdKey="id"
        data={{
          labels: Array.from(Array(scoreData.length + 1).keys()).map(i => i),
          datasets: [
            {
              data: scoreData,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              pointBackgroundColor: 'rgba(52, 152, 219, 1)',
              pointBorderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 2,
              pointBorderWidth: 2,
              pointHoverRadius: 2,
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
            mode: 'index',
          },
          scales: {
            x: {
              display: false,
              ticks: {
                display: false,
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
        }}
      />
    </>
  );
};

export default StatsPlayerChart;
