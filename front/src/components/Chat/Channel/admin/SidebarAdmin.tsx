import React, { useState, useRef, useEffect } from 'react';
// import { BiChevronLeftCircle } from 'react-icons/bi';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Box, Button } from '@mui/material';
import { RoomInterface, UserInterface } from '../../../../types';
import AdminUserCard from './UserCardAdmin';

interface SideBarProps {
  room: RoomInterface;
  setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBarAdmin: React.FC<SideBarProps> = ({ room, setIsAdminMenuOpen }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target)) {
        setOpen(false);
        setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => document.removeEventListener('mousedown', ClickOutside);
  }, [ref, setIsAdminMenuOpen]);

  const handleOpen = () => {
    setIsAdminMenuOpen(!open);
    setOpen(!open);
  };

  const handleAddAdmin = () => {
    console.log('handleAddAdmin');
  };

  const handleDeleteChannel = () => {
    console.log('handleDeleteChannel');
  };

  return (
    <div className="absolute right-0 top-[64px]">
      <div ref={ref} className={'border-stone-300 shadow-gray-300 text-right'} >
        <Button
          className='text-blue-500'
          onClick={handleOpen}
        >
          <ArrowBackIosNewOutlinedIcon className={`${open && 'rotate-180'}`} />
          <p className={'text-center'} > admin </p>
        </Button>

        <div className={`rounded-md transition-all duration-1000 ease-in-out transform overflow-hidden origin-top-right ${open
          ? 'scale-100 visible opacity-100 z-50 bg-slate-400 border-stone-300 shadow-gray-300'
          : 'scale-0 invisible opacity-0 z-0 border-stone-300 shadow-gray-300'
        }`}>
          {/* {open && */}
          <div className='min-w-[50vw]'>  {/* w-[calc(100vw-275px)]  */}
            <div className={'bg-white m-1 p-2 font-mono shadow rounded-md shadow-gray-300 transition-all duration-1000 ease-in-out'} >
              <Box sx={{
                className: 'w-full absolute bottom-0 left-0',
                bgcolor: 'background.paper',
                
              }}>
                
                <Button
                  variant='outlined'
                  className='text-blue-500'
                  onClick={handleAddAdmin}
                  sx={{ mr: 1 }}
                >
                  Add admin
                </Button>
                <Button
                  variant='outlined'
                  className='text-blue-500'
                  onClick={handleDeleteChannel}
                  color='error'
                >
                  Delete channel
                </Button>
              </Box>

              {/* <div className='flex flex-row items-center'>
                <p className='text-blue-500' >{room.name}</p>
              </div> */}
              {room.users &&
                room.users.map((user: UserInterface) => (
                  <AdminUserCard key={user.id} user={user} room={room} />
                ))
              }


            </div>
          </div>
          {/* } */}
        </div>
      </div>
    </div>

  );
};

export default SideBarAdmin;

