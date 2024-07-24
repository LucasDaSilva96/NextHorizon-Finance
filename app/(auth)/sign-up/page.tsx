import AuthForm from '@/components/AuthForm';
import React from 'react';

export default function Sign_Up_Page() {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      <AuthForm type='sign-up' />
    </section>
  );
}
