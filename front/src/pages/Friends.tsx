import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import WaitingAcceptRequest from '../components/Friends/WaitingAcceptRequest';
import WaitingRequestSent from '../components/Friends/WaitingRequestSent';
import AllFriends from '../components/Friends/AllFriends';
import BlockedUser from '../components/Friends/BlockedUser';
import OnLineFriends from '../components/Friends/OnLineFriends';
import AddFriends from '../components/Friends/AddFriends';

import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
const tabMapReverse = ['online', 'all', 'waiting_received', 'waiting_sent', 'blocked', 'add'];
const tabMap = {
  online: 0,
  all: 1,
  waiting_received: 2,
  waiting_sent: 3,
  blocked: 4,
  add: 5,
};


export default function FriendsPage() {
  const [value, setValue] = useState<number>(0);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const [blockedCount, setBlockedCount] = useState<number>(0);
  const [waitingRequestCount, setWaitingRequestCount] = useState<number>(0);
  const [waitingSentCount, setWaitingSentCount] = useState<number>(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.userData);
  
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


  useEffect(() => {
    console.log('value : ', value);
  }, [value]);


  useEffect(() => {
    if (userData.friends) {
      setFriendsCount(userData.friends.length);
      setOnlineCount(userData.friends.filter((f) => f.status !== 'offline').length);
    }
  }, [userData.friends]);

  useEffect(() => {
    if (userData.waitingFriendsRequestReceived)
      setWaitingRequestCount(userData.waitingFriendsRequestReceived.length);
  }, [userData.waitingFriendsRequestReceived]);

  useEffect(() => {
    if (userData.waitingFriendsRequestSent)
      setWaitingSentCount(userData.waitingFriendsRequestSent.length);
  }, [userData.waitingFriendsRequestSent]);

  useEffect(() => {
    if (userData.userBlocked)
      setBlockedCount(userData.userBlocked.length);
  }, [userData.userBlocked]);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`?tab=${tabMapReverse[newValue]}`, { replace: true });
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Friends
            </Typography>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor={'secondary'}
              // selectionFollowsFocus={true}
              textColor="inherit"
              // variant="fullWidth"
              variant="scrollable"
              scrollButtons={true}
              // visibleScrollbar={true}
              aria-label="nav friends"
            >
              <Tab label={'Online' + (onlineCount ? ' (' + onlineCount + ')' : '')}/>
              <Tab label={'All Friends' + (friendsCount ? ' (' + friendsCount + ')' : '')} />
              <Tab label={'Waiting received' + (waitingRequestCount ? ' (' + waitingRequestCount + ')' : '')} />
              <Tab label={'Waiting sent' + (waitingSentCount ? ' (' + waitingSentCount + ')' : '')} />
              <Tab label={'Blocked' + (blockedCount ? ' (' + blockedCount + ')' : '')} />
              <Tab label="Add Friend" />
            </Tabs>
          </Toolbar>
        </AppBar>

        <TabPanel value={value} index={0}> <OnLineFriends /> </TabPanel>
        <TabPanel value={value} index={1}> <AllFriends /> </TabPanel>
        <TabPanel value={value} index={2}> <WaitingAcceptRequest /> </TabPanel>
        <TabPanel value={value} index={3}> <WaitingRequestSent /> </TabPanel>
        <TabPanel value={value} index={4}> <BlockedUser /> </TabPanel>
        <TabPanel value={value} index={5}> <AddFriends /> </TabPanel>
      </Box>
    </>
  );
}