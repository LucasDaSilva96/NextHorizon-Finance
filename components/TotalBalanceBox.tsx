import React from 'react';
import CountUpComponent from './CountUpComponent';
import DoughnutChart from './DoughnutChart';

export default function TotalBalanceBox({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) {
  return (
    <section className='total-balance'>
      <div className='total-balance-chart'>
        <DoughnutChart accounts={accounts} />
      </div>
      <div className='flex flex-col gap-6'>
        <h2 className='header-2'>Bank Accounts: {totalBanks}</h2>
        <div className='flex flex-col gap-2'>
          <p className='total-balance-label'>Total Current Balance</p>
          <div className='total-balance-amount flex-center gap-2'>
            <CountUpComponent end={totalCurrentBalance} duration={2.25} />
          </div>
        </div>
      </div>
    </section>
  );
}
