import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react';

export default async function My_Banks_Page() {
  const user = await getLoggedInUser();
  const accounts = await getAccounts({ userId: user?.$id! });

  if (!accounts) {
    return <h1>Loading...</h1>;
  }
  return (
    <section className='flex'>
      <div className='my-banks'>
        <HeaderBox
          title='My Bank Accounts'
          subtext='Effortless manage your banking activities.'
        />

        <div className='space-y-4'>
          <h2 className='header-2'>Your card</h2>

          <div className='flex flex-wrap gap-6'>
            {accounts?.data.map((account: Account) => (
              <BankCard
                key={account.id}
                account={account}
                userName={user?.firstName! + ' ' + user?.lastName!}
                showBalance={true}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
