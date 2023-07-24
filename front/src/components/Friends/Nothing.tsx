import sadBall from "../../assets/sadBall.png";
import angryBall from "../../assets/angryBall.png";

export function Nothing({ text, angry }) {
  return (
    <div className="flex justify-center items-center h-full md:flex-row bg-[var()] flex-col">
      <h1 className="text-2xl font-bold">{text}</h1>
      <img src={angry ? angryBall : sadBall} className="w-2/6" />
    </div>
  );
}
