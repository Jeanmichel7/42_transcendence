import { useEffect, useMemo, useState } from 'react';
import { TrophyInterface } from '../../types/UserTypes';
import { useImage } from '../../utils/hooks';
import trophyImages from './TrophyImages';

interface Trophy {
  trophy: TrophyInterface;
}

export const TrophyCard = ({ trophy }: Trophy) => {
  //const { loading, error, imageSrc } = useImage(trophy.imagePath);
  const imageSrc = trophyImages[trophy.name];
  return (
    <div className="p-4 rounded shadow-custom bg-white flex m-2">
      <img src={imageSrc} alt={trophy.name} className="w-16 h-16 mr-4" />
      <div>
        <h2 className="font-bold text-xl mb-2">{trophy.name}</h2>
        <p>{trophy.description}</p>
      </div>
    </div>
  );
};
