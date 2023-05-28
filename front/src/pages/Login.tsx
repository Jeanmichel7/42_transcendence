
import React from 'react';
import { Link } from 'react-router-dom';

const BouncingBall = ({ color, left, top }) => (
  <div className="w-8 h-8 rounded-full absolute animate-bounce delay-1000 duration-2000 shadow-xl"
       style={{ backgroundColor: color, left: `${left}%`, top: `${top}%`, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}` }} />
);

export default function Login() {
  const colors = ["#22D3EE", "#A020F0", "#1B262C", "#FDFFFC", "#FF6B00"];

  const positions = colors.map((_, i) => {
    const angle = (2 * Math.PI / colors.length) * i;
    const left = 50 + 45 * Math.cos(angle);
    const top = 50 + 45 * Math.sin(angle);
    return { left, top };
  });

  return (
    <div name="global" className="relative flex flex-col items-center justify-center h-screen bg-center bg-cover text-white" backgroungSize="cover"
         style={{ backgroundImage: "url(../../public/background.png)" }}>

      {positions.map((pos, i) => (
        <BouncingBall key={i} color={colors[i]} left={pos.left} top={pos.top} />
      ))}

      <h1 className="text-9xl font-bold text-white text-shadow bg-black bg-opacity-50 py-0 px-4 rounded ml-20">PONG</h1>
      <p className="mt-5 mb-10 text-xl font-bold text-shadow bg-black bg-opacity-50 py-2 px-4 rounded ml-20">The ultimate online Pong experience</p>
      <Link
        className="px-4 py-2 ml-20 text-xl text-white rounded-full shadow hover:bg-black transition-all duration-300"
        style={{ backgroundColor: '#22D3EE', boxShadow: `0 0 50px white, 0 0 20px black, 0 0 30px black, 0 0 40px black` }}
        to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code"
      >
        Login as a 42 student
      </Link>
    </div>
  );
}

