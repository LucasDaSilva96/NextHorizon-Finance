import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react';

export default async function Payment_Transfer_Page() {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id! });

  if (!accounts || accounts?.data.length === 0) {
    return <h1>Loading...</h1>;
  }
  return (
    <section className='payment-transfer'>
      <HeaderBox
        title='Payment Transfer'
        subtext='Please provide any specific details or notes to the payment transfer'
      />

      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accounts?.data} />
      </section>
    </section>
  );
}
