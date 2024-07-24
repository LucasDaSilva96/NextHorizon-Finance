'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { z } from 'zod';
import CustomInput from './CustomInput';
import { formSchema } from '@/lib/utils';

export default function AuthForm({ type }: { type: 'sign-in' | 'sign-up' }) {
  // 1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [user, setUser] = useState(null);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link
          href='/'
          className='
        cursor-pointer text-center gap-1 px-4 flex items-center'
        >
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='horizon logo'
          />
          <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
            NextHorizon
          </h1>
        </Link>

        <div className='flex flex-col gap-1 md:gap-3'>
          <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className='text-16 font-normal text-gray-600'>
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>

      {user ? (
        <div className='flex flex-col gap-4'>{/* PlaidLink */}</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <CustomInput
              autocomplete='true'
              control={form.control}
              name='email'
              placeholder='Enter your email'
              label='Email'
              type='email'
            />

            <CustomInput
              autocomplete='true'
              control={form.control}
              name='password'
              placeholder='Enter your password'
              label='Password'
              type='password'
            />

            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      )}
    </section>
  );
}
