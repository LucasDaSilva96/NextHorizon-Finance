import HeaderBox from '@/components/HeaderBox';
import RightSideBar from '@/components/RightSideBar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react';

export default function HomePage() {
  const loggedIn = {
    $id: '1',
    email: 'test@test.com',
    userId: '2',
    dwollaCustomerUrl: 'https://api-sandbox.dwolla.com/customers/2',
    dwollaCustomerId: '2',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    city: 'Anytown',
    state: 'NY',
    postalCode: '12345',
    dateOfBirth: '1990-01-01',
    ssn: '5135',
  };
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            title='Welcome'
            type='greeting'
            user={loggedIn?.firstName || 'Guest'}
            subtext='Access and manage your account and transactions efficiently.'
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1550.35}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      <RightSideBar user={loggedIn} transactions={[]} banks={[{}, {}]} />
    </section>
  );
}
