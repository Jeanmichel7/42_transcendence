import { Button } from '@mui/material';

export function ButtonCreateGroup() {
  return (
    <Button
      variant="contained"
      color="secondary"
      sx={{ display: 'block', margin: '5px' }}
    >
      Create Channel
    </Button>
  );
}


export function ButtonInterfaceAddGroups() {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ display: 'block', margin: '5px' }}
    >
      Add Groups
    </Button>
  );
}

export function ButtonInterfaceAddFriends() {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ display: 'block', margin: 'auto' }}
    >
      Add Friends
    </Button>
  );
}