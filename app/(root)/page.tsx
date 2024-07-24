import HeaderBox from '@/components/HeaderBox';
import React from 'react';

export default function HomePage() {
  const loggedIn = { firstName: 'John' };
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
        </header>
      </div>
    </section>
  );
}
