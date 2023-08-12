import sadBall from '../../assets/sadBall.png';
import angryBall from '../../assets/angryBall.png';

interface NothingProps {
  text: string;
  angry?: boolean;
}

export function Nothing({ text, angry }: NothingProps) {
  return (
    <div className="flex justify-center items-center md:flex-row flex-col w-full">
      <h1 className="text-2xl font-bold  text-gray-500">{text}</h1>
      <img src={angry ? angryBall : sadBall} className="w-1/6" />
    </div>
  );
}
