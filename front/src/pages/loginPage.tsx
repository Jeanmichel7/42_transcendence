// import React from 'react'
import {Link} from 'react-router-dom'
import React from 'react'
// import axios from 'axios'

// import LoginBtn from '../components/Login/LoginBtn'
// import Register from './register'

// import './login.css'

export default function Login() {
  return (
    <div className=" w-auto flex items-center justify-center bg-[#1e1e4e]">
      <span className="hello">

        <div className="m-6 text-center font-bold ">
          <p className="text-[#f84aab] font-Dance text-6xl drop-shadow-2xl " >Welcome to</p>
          <p className="text-[#09d9f0] font-Bungee text-8xl">PONG</p>
        </div>

        <div className="m-6 text-center text-white font-mono border-double border-4 rounded-xl border-[#f4fa22]" >
          <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">Login as a 42 student</Link>
        </div>

      </span>
    </div>
  )
}