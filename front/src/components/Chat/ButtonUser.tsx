import { useState, useRef, useEffect } from 'react';
import { ImPencil, ImBlocked } from 'react-icons/im';

function ButtonUser() {
  const [open, setOpen] = useState(false);
  const [print, setPrint] = useState(false);

  let ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => {
      document.removeEventListener('mousedown', ClickOutside);
    };
  }, [ref]);

  return (
    <div>
      <div
        className={` m-2 my-5 text-center w-3/12 border-2 rounded-xl shadow-lg font-mono py-2 cursor-pointer hover:bg-gray-100 transition-all ${
          open ? 'bg-gray-100' : ''
        } `}
        onClick={() => setOpen(!open)}
      >
        User
      </div>

      <div
        ref={ref}
        className={`absolute left-1/4 top-16 z-40 bg-white mt-5 m-10 p-2 border shadow-lg text-center w-3/12 rounded-xl ${
          open ? '' : ' hidden'
        } transition-all`}
      >
        <div className="m-2 p-2 border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left">
          <div className=" pl-1 basis-8/12 ">User 1</div>
          <div className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all">
            <ImPencil className="m-1" />
            <div className="absolute group-hover:block text-center w-80 text-sm bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
              Send direct message to user.
            </div>
          </div>
          <div className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all">
            <ImBlocked className="m-1" />
            <div className="absolute group-hover:block text-center w-40 text-sm bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
              Block user
            </div>
          </div>
        </div>

        <div className="m-2 p-2 border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left">
          <div className=" pl-1 basis-8/12 ">User 2</div>
          <div className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all">
            <ImPencil className="m-1" />
            <div className="absolute group-hover:block text-center w-80 bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
              Send direct message to user.
            </div>
          </div>
          <div className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all">
            <ImBlocked className="m-1" />
            <div className="absolute group-hover:block text-center w-40 bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
              Block user
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonUser;
