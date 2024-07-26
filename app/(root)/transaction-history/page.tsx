import HeaderBox from '@/components/HeaderBox';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Transaction_History_Page({
  searchParams,
}: SearchParamProps) {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id! });

  if (!accounts) {
    return;
  }

  const appwriteItemId = accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  if (!loggedIn) {
    return redirect('/sign-in');
  }

  return (
    <section className='transactions'>
      <div className='transaction-header'>
        <HeaderBox
          title='Transaction History'
          subtext='See your bank detail and transactions.'
        />
      </div>

      <div className='space-y-6'>
        <div className='transactions-account'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-18 font-bold text-slate-50'>
              {account?.data.name}
            </h2>
            <p className='text-14 text-blue-25'>
              {account?.data?.officialName}
            </p>

            <p className='text-14 font-semibold tracking-[1.1px] text-slate-50'>
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679;
              &#9679;&#9679;&#9679;&#9679;{' '}
              <span className='text-16'>{account?.data?.mask}</span>
            </p>
          </div>

          <div className='transactions-account-balance'>
            <p className='text-14'>Current balance</p>
            <p className='text-14 text-center font-bold'>
              {formatAmount(account?.data?.currentBalance)}
            </p>
          </div>
        </div>

        <section className='flex w-full flex-col gap-6'>
          <TransactionsTable transactions={account?.transactions} />
        </section>
      </div>
    </section>
  );
}
