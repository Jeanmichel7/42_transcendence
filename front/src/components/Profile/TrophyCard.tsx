import { Box, LinearProgress } from '@mui/material';
import { TrophyInterface } from '../../types/TrophiesTypes';
import trophyImages from './TrophyImages';
import { useEffect, useState } from 'react';

interface TrophyProps {
  trophy: TrophyInterface;
}

export const TrophyCard = ({ trophy }: TrophyProps) => {
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    if (!trophy) return;

    const ratio = (trophy.progress / trophy.total) * 100;
    if (ratio > 100) setProgress(100);
    else if (trophy.isHeld) setProgress(100);
    else if (trophy.total === 0) setProgress(0);
    else setProgress(ratio);
    setImageSrc(trophyImages[trophy.name as keyof typeof trophyImages]);
  }, [trophy]);

  return (
    <div
      className={`relative w-full text-center rounded-t-lg rounded-b-md
      bg-white
      m-2 mx-20 sm:mx-2
      sm:w-[40vw] md:w-[30vw] lg:w-[20vw] shadow-custom 
      ${trophy.isHeld ? 'border-blue-400' : 'opacity-60'}
      flex flex-col justify-between 
    `}
    >
      <h2 className="font-bold text-xl bg-blue-200 p-1 rounded-t-md truncate whitespace-nowrap overflow-hidden">
        {trophy.name}
      </h2>
      <div className="flex justify-center items-center p-1 text-left">
        <img
          src={imageSrc}
          alt={trophy.name}
          className="h-16 mx-1 cover pb-1"
        />
        <p className="flex-grow">{trophy.description}</p>
      </div>
      {trophy.isHeld ? (
        <p className="absolute bottom-1 right-0 text-end text-sm mr-1 text-gray-400">
          {!trophy.total ? '1/1' : trophy.total + '/' + trophy.total}
        </p>
      ) : (
        <p className="absolute bottom-1 right-0 text-end text-sm mr-1 text-gray-400">
          {!trophy.total ? '0/1' : trophy.progress + '/' + trophy.total}
        </p>
      )}
      <Box sx={{ width: '100%', border: '51px' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            borderEndEndRadius: '50px',
            borderEndStartRadius: '50px',
          }}
        />
      </Box>
    </div>
  );
};
