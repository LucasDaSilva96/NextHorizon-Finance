import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSideBar from '@/components/RightSideBar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function HomePage({
  searchParams: { id, page },
}: SearchParamProps) {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id! });
  const currentPage = Number(page as string) || 1;

  if (!accounts) {
    return;
  }

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  if (!loggedIn) {
    return redirect('/sign-in');
  }

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            title='Welcome'
            type='greeting'
            user={
              (loggedIn?.firstName &&
                loggedIn?.lastName &&
                `${loggedIn.firstName} ${loggedIn.lastName}`) ||
              'Guest'
            }
            subtext='Access and manage your account and transactions efficiently.'
          />
          <TotalBalanceBox
            accounts={accounts?.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accounts?.data}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSideBar
        user={loggedIn}
        transactions={accounts?.data?.transactions}
        banks={accounts?.data?.slice(0, 2)}
      />
    </section>
  );
}
