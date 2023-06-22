interface LoaderperosnalizedProps {
  top: number,
  left: number,
}

const Loaderperosnalized = ({
  top,
  left,
}: LoaderperosnalizedProps) => {
  return (
    <div className="relative h-full w-full">
      <div className={`absolute animate-spin top-[${top}%] left-[${left}%] 
        rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900`}>
      </div>
    </div>
  );
};

export default Loaderperosnalized;