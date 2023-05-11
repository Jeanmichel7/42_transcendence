import React from 'react'
import {AiOutlineEllipsis, AiOutlineArrowLeft} from "react-icons/ai";
import {useState, useRef, useEffect} from 'react';
import { BiBadgeCheck, BiXCircle, BiCircle, BiVolumeMute, BiBadge, BiVolume} from "react-icons/bi";

const SetPassword = ({password,open, setPassword}:{password:boolean,open:boolean, setPassword: React.Dispatch<React.SetStateAction<boolean>>}) => {

  const refPassword:any = useRef();
  let channelPassword:string;
  let ref = useRef(document.createElement('div'));

  // password Input
  const handleInput = (e:any) => {
      e.preventDefault();
      channelPassword = refPassword.current.value;
      console.log(channelPassword);
      refPassword.current.value="";
  }

  useEffect(() => {
    const ClickOutside = (event:any) => {
     if (!ref.current.contains(event.target))
      setPassword(false);
    }
    document.addEventListener('mousedown', ClickOutside)
    return () => {document.removeEventListener('mousedown', ClickOutside)};
  }, [ref]);
  
  return (
    <div ref={ref} className={`my-2 absolute border-2 -mx-4 rounded-xl w-5/12 left-0 top-full my-3" ${password? "" : "hidden" } ${open?"":"hidden"} `} >
      <div>
        Set channel password
      </div>
      <form onSubmit={handleInput}>
        <input ref={refPassword} placeholder=' password...' className='rounded-xl border-2 m-1 w-2/3 ' type="text"  />
        <button className={` border bg-gray-200 hover:bg-white cursor-pointer rounded-xl px-3 transition-all `} onClick={() => setPassword(!password)} >Add</button>
      </form>
    </div>
)
}

const ManageUsers = ({manage, open, setManage}:{manage:boolean, open:boolean, setManage:React.Dispatch<React.SetStateAction<boolean>>}) => {

  const [admin, setAdmin] = useState(false);

  const [BanMenu, setBan] = useState(false);
  const [IsBan, setIsBan] = useState(false);

  const [MuteMenu, setMute] = useState(false);
  const [IsMute, setIsMute] = useState(false);

  let ref = useRef(document.createElement('div'));
  let refBan = useRef(document.createElement('div'));
  let refMute = useRef(document.createElement('div'));

  // useEffect(() => {
  //   const ClickOutsideManage = (event:any) => {
  //    if (!ref.current.contains(event.target))
  //     setManage(false);
  //   }

  //   const ClickOutsideBan = (event:any) => {
  //    if (!refBan.current.contains(event.target))
  //     setManage(false);
  //   }

  //   const ClickOutsideMute = (event:any) => {
  //    if (!refMute.current.contains(event.target))
  //     setManage(false);
  //   }
  //   document.addEventListener('mousedown', ClickOutsideManage)
  //   document.addEventListener('mousedown', ClickOutsideBan)
  //   document.addEventListener('mousedown', ClickOutsideMute)

  //   return ( 
  //     () => {document.removeEventListener('mousedown', ClickOutsideManage)});
  //     () => {document.removeEventListener('mousedown', ClickOutsideMute)};
  //     () => {document.removeEventListener('mousedown', ClickOutsideBan)};
  //   );

  // }, [ref]);

  return (
    <div ref={ref} className={` h-40 y-2 absolute border-2 overflow-x-auto rounded-xl w-7/12 right-0 top-full my-3" ${manage? "" : "hidden" } ${open?"":"hidden"}  `} >

        <div className={` border rounded-lg p-1 h-1/4  m-1 flex justify-center items-center flex-row ${IsBan?'bg-red-200':''} `} >
          <p className=" rounded-lg p-1 m-1 basis-8/12" > User1 </p>

          <div className='relative group block' onClick={() => setAdmin(!admin)} >
            <BiBadgeCheck className={` text-gray-500 hover:text-black m-2 text-2xl ${admin && 'hidden'} `}/>
            <BiBadge className={`  text-gray-500 hover:text-black m-2 text-2xl ${!admin && 'hidden'} `}/>
            <div className='absolute group-hover:block text-center bg-slate-800 text-white text-sm shadow-sm hidden font-mono p-2 rounded-md transition-all'>Admin</div> 
          </div>

          <div className={` relative group block ${BanMenu && 'hidden'} ${IsBan && 'hidden'} `} onClick={() => setBan(!BanMenu)} >
            <BiCircle className={`text-gray-500 hover:text-black m-2 text-2xl ${IsBan && 'hidden'}`}/>
              <div className={`absolute group-hover:block text-center bg-slate-800 text-white text-sm shadow-sm hidden font-mono p-2 rounded-md transition-all ${!IsBan && 'hidden'}`}>Ban</div> 
          </div>
          <div ref={refBan} className={`flex flex-col text-xs border z-50 rounded-md bg-slate-100 overflow-auto h-full w-1/3 transition-all ${!BanMenu && 'hidden'} ${IsBan && 'hidden'}`}>
              <button className='border z-50 m-1 hover:bg-white transition-all rounded-md' onClick={() => {setBan(!BanMenu); setIsBan(!IsBan)}} >1h</button>
              <button className='border  hover:bg-white transition-all rounded-md' onClick={() => {setBan(!BanMenu); setIsBan(!IsBan)}} >4h</button>
              <button className='border m-1 hover:bg-white transition-all rounded-md' onClick={() => {setBan(!BanMenu); setIsBan(!IsBan)}} >24h</button>
              <button className='border  hover:bg-white transition-all rounded-md' onClick={() => {setBan(!BanMenu); setIsBan(!IsBan)}} >Indef</button>
          </div>
          <div className={` relative group block ${!IsBan && 'hidden'} `} onClick={() => setIsBan(!IsBan)}>
            <BiXCircle className={`text-gray-500 hover:text-black m-2 text-2xl`}/>
              <div className={`absolute group-hover:block text-center bg-slate-800 text-white text-sm shadow-sm hidden font-mono p-2 rounded-md transition-all ${!IsBan && 'hidden'}`}>UnBan</div> 
          </div>

          <div className={` relative group block ${MuteMenu && 'hidden'} ${IsMute && 'hidden'} `} onClick={() => setMute(!BanMenu)} >
            <BiVolume className={`text-gray-500 hover:text-black m-2 text-2xl ${IsMute && 'hidden'}`}/>
              <div className={`absolute group-hover:block text-center bg-slate-800 text-white text-sm shadow-sm hidden font-mono p-2 rounded-md transition-all -left-2 ${!IsMute && 'hidden'}`}>Mute</div> 
          </div>
          <div ref={refMute} className={`flex flex-col text-xs border z-50 rounded-md bg-slate-100 overflow-auto h-full w-1/3 transition-all ${!MuteMenu && 'hidden'} ${IsMute && 'hidden'}`}>
              <button className='border z-50 m-1 hover:bg-white transition-all rounded-md' onClick={() => {setMute(!MuteMenu); setIsMute(!IsMute)}} >1h</button>
              <button className='border  hover:bg-white transition-all rounded-md' onClick={() => {setMute(!MuteMenu); setIsMute(!IsMute)}} >4h</button>
              <button className='border m-1 hover:bg-white transition-all rounded-md' onClick={() => {setMute(!MuteMenu); setIsMute(!IsMute)}} >24h</button>
              <button className='border  hover:bg-white transition-all rounded-md' onClick={() => {setMute(!MuteMenu); setIsMute(!IsMute)}} >Indef</button>
          </div>
          <div className={` relative group block ${!IsMute && 'hidden'} `} onClick={() => setIsMute(!IsMute)}>
            <BiVolumeMute className={`text-gray-500 hover:text-black m-2 text-2xl`}/>
              <div className={`absolute group-hover:block text-center bg-slate-800 text-white text-sm shadow-sm hidden font-mono p-2 rounded-md transition-all -left-5 ${!IsMute && 'hidden'}`}>UnMute</div> 
          </div>
        </div>

    </div>
  )
}

function BarAdmin () {

    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState(false);
    const [manage, setManage] = useState(false);

  return (
    <div className= {`absolute flex flex-row right-2 top-10 cursor-pointer transition-all rounded-xl p-1 ${!open?'':' w-11/12'}`}  >
        <AiOutlineArrowLeft className={` text-3xl hover:bg-gray-200 cursor-pointer transition-all rounded-xl duration-700 ${open?'rotate-180':''} `} onClick={() => setOpen(!open)} />
        <div className= {` ${!open && "hidden"} ${password?'bg-gray-200':''} mx-1 group basis-4/12 border rounded-lg p-1 hover:bg-gray-200 transition-all `} onClick={() => setPassword(!password)} >
            Set password
        </div>
        <SetPassword password = {password} open = {open} setPassword = {setPassword}   />
        <div className= {` z-30 ${!open && "hidden"} ${manage?'bg-gray-200':''} mx-1 group basis-7/12 border rounded-lg p-1 hover:bg-gray-200 transition-all `} onClick={() => setManage(!manage)} >
            Manage Users
        </div>
        <ManageUsers manage = {manage} open = {open} setManage = {setManage}  />

    </div>
  )
}
export default BarAdmin;