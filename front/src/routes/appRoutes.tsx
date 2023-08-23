import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Loaderperosnalized from '../utils/LoaderPerosnalized';

// const Login = React.lazy(() => import('../pages/Login'));
import Login from '../pages/Login';
const Chat = React.lazy(() => import('../pages/Chat'));
const Account = React.lazy(() => import('../pages/Account'));
// const Pong = React.lazy(() => import('../pages/Pong'));
import Pong from '../pages/Pong';
import About from '../pages/About';
const Profile = React.lazy(() => import('../pages/Profile'));
const Error404 = React.lazy(() => import('../pages/Error404'));
const FriendsPage = React.lazy(() => import('../pages/Friends'));
const LeaderBoard = React.lazy(() => import('../pages/LeaderBoard'));
const Achievement = React.lazy(() => import('../pages/Achievement'));
const HomeChat = React.lazy(() => import('../components/Chat/HomeChat'));

const CreateGroupInterface = React.lazy(
  () =>
    import('../components/Chat/ConversationList/outlet/ChannelCreateInterface'),
);
const ChannelSearch = React.lazy(
  () =>
    import('../components/Chat/ConversationList/outlet/ChannelSearchInterface'),
);
const FriendsSearch = React.lazy(
  () =>
    import('../components/Chat/ConversationList/outlet/FriendsSearchInterface'),
);
const ConversationWrapper = React.lazy(
  () => import('../components/Chat/ConversationWrapper'),
);
const InvitationWrapper = React.lazy(
  () => import('../components/Chat/Channel/InvitationWrapper'),
);

const AppRoutes: React.FC = () => (
  <>
    <div className="mt-[56px]" />
    <React.Suspense fallback={<Loaderperosnalized />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game" element={<Pong />} />
        <Route path="/chat" element={<Chat />}>
          <Route index element={<HomeChat />} />
          <Route
            path="conv/:convId/:id/:login"
            element={<ConversationWrapper />}
          />
          <Route
            path="channel/:convId/:id/:name"
            element={<ConversationWrapper />}
          />
          <Route
            path="channel/invitation/:channelId/:channelName"
            element={<InvitationWrapper />}
          />
          <Route
            path="addFriends"
            element={<FriendsSearch setHeight={true} />}
          />
          <Route path="createChannel" element={<CreateGroupInterface />} />
          <Route path="addChannels" element={<ChannelSearch />} />
          <Route path="*" element={<HomeChat />} />
        </Route>
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/profile/:pseudo" element={<Profile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/achievement" element={<Achievement />} />
        <Route path="/achievement/:login" element={<Achievement />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </React.Suspense>

    <div className="flex-grow" />
  </>
);

export default AppRoutes;
