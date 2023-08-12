import { TrophyInterface } from '../../types/UserTypes';
import trophyImages from './TrophyImages';

interface Trophy {
  trophy: TrophyInterface;
}

export const TrophyCard = ({ trophy }: Trophy) => {
  //const { loading, error, imageSrc } = useImage(trophy.imagePath);
  const imageSrc = trophyImages[trophy.name];
  return (
    <div className='rounded-md shadow-custom bg-white mx-2 text-center'>
      <h2 className="font-bold text-xl bg-blue-100 p-2 rounded-t-md">{trophy.name}</h2>
      <div className="flex justify-center items-center p-3 text-left">
        <img src={imageSrc} alt={trophy.name} className="w-16 h-16 mx-2" />
        <p>{trophy.description}</p>
      </div>
    </div>
  );
};
