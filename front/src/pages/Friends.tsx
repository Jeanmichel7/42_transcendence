import { useState } from 'react';

import WaitingAcceptRequest from '../components/Friends/WaitingAcceptRequest';
import WaitingRequestSent from '../components/Friends/WaitingRequestSent';
import AllFriends from '../components/Friends/AllFriends';
import BlockedUser from '../components/Friends/BlockedUser';

import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import OnLineFriends from '../components/Friends/OnLineFriends';
import AddFriends from '../components/Friends/AddFriends';

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


export default function FriendsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', width: 'auto' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Friends
            </Typography>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Online" />
              <Tab label="All Friend" />
              <Tab label="Waiting accept " />
              <Tab label="Waiting send" />
              <Tab label="Blocked" />
              <Tab label="Add Friend" />
            </Tabs>
          </Toolbar>

        </AppBar>

        <TabPanel value={value} index={0} >
          <OnLineFriends />
        </TabPanel>
        <TabPanel value={value} index={1} >
          <AllFriends />
        </TabPanel>
        <TabPanel value={value} index={2} >
          <WaitingAcceptRequest />
        </TabPanel>
        <TabPanel value={value} index={3} >
          <WaitingRequestSent />
        </TabPanel>
        <TabPanel value={value} index={4} >
          <BlockedUser />
        </TabPanel>
        <TabPanel value={value} index={5} >
          <AddFriends />
        </TabPanel>

      </Box>
    </>
  );
}