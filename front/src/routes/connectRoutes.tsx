import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ConnectPage from '../pages/Connection';
import AccountConnection from '../pages/ConnectionFakeUser';
import OAuthRedirect from '../pages/OAuthRedirect';

const connectRoutes: React.FC = () => {
  console.log('coucou');

  return (
    <Routes>
      <Route path="/connection" element={<ConnectPage />} />
      <Route path="/accountconnection" element={<AccountConnection />} />
      <Route path="/oauthredirection" element={<OAuthRedirect />} />
    </Routes>
  );
};

export default connectRoutes;
