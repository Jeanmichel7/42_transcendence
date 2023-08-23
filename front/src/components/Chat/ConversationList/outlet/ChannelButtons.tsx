import { Button } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

export function ButtonCreateGroup() {
  return (
    <Link to="/chat/createChannel" className="w-full">
      <Button color="primary" className="w-full">
        <p className="mr-2 text-green-700 font-bold">Create</p>
        <AddCircleOutlineIcon color="success" />
      </Button>
    </Link>
  );
}

export function ButtonInterfaceAddGroups() {
  return (
    <Link to="/chat/addChannels">
      <Button color="primary" className="w-full">
        <p className="mr-2 font-bold ">Search</p>
        <SearchIcon />
      </Button>
    </Link>
  );
}

export function ButtonInterfaceAddFriends() {
  return (
    <div className="bg-gray-300">
      <Link to="/chat/addFriends">
        <Button>
          <p className="mr-24 text-blue-700 font-bold "> add friends </p>
          <PersonAddOutlinedIcon color="success" />
        </Button>
      </Link>
    </div>
  );
}
