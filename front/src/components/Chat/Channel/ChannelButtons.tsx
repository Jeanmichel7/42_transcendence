import { Button, IconButton, Tooltip, Zoom } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { Link } from 'react-router-dom';

export function ButtonCreateGroup() {
  return (
    <Link to='/chat/createChannel'>
      <Button
        variant="contained"
        color="secondary"
        sx={{ display: 'block', margin: '5px' }}
      >
        Create Channel
      </Button>
    </Link>
  );
}

export function ButtonInterfaceAddGroups() {
  return (
    <Link to='/chat/addChannels' >
      <Tooltip
        title="Search channels" arrow
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 600 }}
      >
        <IconButton color='primary' >
          <GroupAddOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
}

export function ButtonInterfaceAddFriends() {
  return (
    <Link to='/chat/addFriends'>
      <Tooltip
        title="Search friends" arrow
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 600 }}
      >
        <IconButton color='primary' >
          <PersonAddOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
}