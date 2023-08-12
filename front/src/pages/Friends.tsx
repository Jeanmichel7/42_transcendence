import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import WaitingAcceptRequest from '../components/Friends/WaitingAcceptRequest';
import WaitingRequestSent from '../components/Friends/WaitingRequestSent';
import AllFriends from '../components/Friends/AllFriends';
import BlockedUser from '../components/Friends/BlockedUser';
import OnLineFriends from '../components/Friends/OnLineFriends';
import AddFriendsRaw from '../components/Friends/AddFriends';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

import { AppBar, Box, Button, Tab, Tabs, Theme, useMediaQuery } from '@mui/material';
import FriendsSearch from '../components/Chat/ConversationList/outlet/FriendsSearchInterface';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const tabMapReverse = [
  'online',
  'all',
  'waiting_received',
  'waiting_sent',
  'blocked',
  'add',
];

const tabMap = {
  online: 0,
  all: 1,
  waiting_received: 2,
  waiting_sent: 3,
  blocked: 4,
  add: 5,
};

export default function FriendsPage() {
  // const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [blockedCount, setBlockedCount] = useState<number>(0);
  const [waitingRequestCount, setWaitingRequestCount] = useState<number>(0);
  const [waitingSentCount, setWaitingSentCount] = useState<number>(0);
  const [viewType, setViewType] = useState<string>('list');

  const matchesSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const location = useLocation();
  const navigate = useNavigate();
  const {
    userData,
    userFriends,
    userBlocked,
    waitingFriendsRequestReceived,
    waitingFriendsRequestSent,
  } = useSelector((state: RootState) => state.user);

  //check query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabType = query.get('tab');
    if (!tabType) return;

    if (tabType in tabMap) {
      // console.log('params : ', serviceParam, userIdParam);
      setValue(tabMap[tabType as keyof typeof tabMap]);
    }
  }, [location.search]);

  // useEffect(() => {
  //   console.log('value : ', value);
  // }, [value]);

  useEffect(() => {
    if (userFriends) {
      setFriendsCount(userFriends.length);
      setOnlineCount(userFriends.filter((f) => f.status !== 'offline').length);
    }
  }, [userFriends]);

  useEffect(() => {
    if (waitingFriendsRequestReceived)
      setWaitingRequestCount(waitingFriendsRequestReceived.length);
  }, [waitingFriendsRequestReceived]);

  useEffect(() => {
    if (waitingFriendsRequestSent)
      setWaitingSentCount(waitingFriendsRequestSent.length);
  }, [waitingFriendsRequestSent]);

  useEffect(() => {
    if (userBlocked) setBlockedCount(userBlocked.length);
  }, [userBlocked]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`?tab=${tabMapReverse[newValue]}`, { replace: true });
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className='bg-inherit'>
      <AppBar position="static">
        <div className="flex bg-gray-800">
          <Tabs
            value={value}
            onChange={handleChange}
            selectionFollowsFocus={true}
            textColor="inherit"
            variant={matchesSmallScreen ? 'fullWidth' : 'scrollable'}
            scrollButtons={true}
            aria-label="nav friends"
            sx={{ width: '100%' }}
          >
            <Tab label={'Online' + (onlineCount ? ' (' + onlineCount + ')' : '')} />
            <Tab label={'All' + (friendsCount ? ' (' + friendsCount + ')' : '')} />
            <Tab label={'Invit received' + (waitingRequestCount ? ' (' + waitingRequestCount + ')' : '')} />
            <Tab label={'Invit sent' + (waitingSentCount ? ' (' + waitingSentCount + ')' : '')} />
            <Tab label={'Blocked' + (blockedCount ? ' (' + blockedCount + ')' : '')} />
            <Tab sx={{ p: 0, m: 0, padding: 0, margin: 0, width: 0 }} disabled />
          </Tabs>

          <Button
            sx={{ pr: 2, m: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
          > {viewType === 'grid' ? <ViewHeadlineIcon /> : <GridViewIcon />}
          </Button>

          <Tab
            label="Add Friend"
            sx={{
              color: '#00CB36',
              fontWeight: 'bold',
              border: '1px solid #00CB36',
              borderRadius: '8px',
            }}
            onClick={() => {
              setValue(5);
              navigate(`?tab=${tabMapReverse[5]}`, { replace: true });
            }}
          />
        </div>
      </AppBar>

      <TabPanel value={value} index={0}>
        <OnLineFriends userDataId={userData.id} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <AllFriends userDataId={userData.id} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <WaitingAcceptRequest />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <WaitingRequestSent />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <BlockedUser />
      </TabPanel>

      <TabPanel value={value} index={5}>
        {viewType === 'grid' ? <FriendsSearch setHeight={false} /> : <AddFriendsRaw />}
      </TabPanel>
    </div>
  );
}
