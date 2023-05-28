import React from 'react'
import AccountProfile from '../components/Account/AccountProfile';
import AccountRelation from '../components/Account/AccountRelation';
import AccountGameHistory from '../components/Account/AccountGameHistory';

export default function Account() {


  return (
    <>
      <AccountProfile />
      <AccountRelation /> 
      <AccountGameHistory />
    </>
  )
}
