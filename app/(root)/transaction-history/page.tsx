import HeaderBox from '@/components/HeaderBox';
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Transaction_History_Page({
  searchParams: { page },
}: SearchParamProps) {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id! });
  const currentPage = Number(page as string) || 1;

  if (!accounts) {
    return;
  }

  const appwriteItemId = accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

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
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className='my-4 w-full'>
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
