'use client';

import { logout } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

export default function Footer({ user, type }: FooterProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await logout();

    if (loggedOut) {
      return router.push('/sign-in');
    } else {
      toast.error('An error occurred while logging out. Please try again.');
    }
  };
  return (
    <footer className='footer'>
      <div
        className={`${
          type === 'mobile' ? 'footer_name-mobile' : 'footer_name'
        }`}
      >
        <p className='text-xl font-bold text-gray-700'>{user.name[0]}</p>
      </div>

      <div
        className={`${
          type === 'mobile' ? 'footer_email-mobile' : 'footer_email'
        }`}
      >
        <h1 className='text-14 truncate font-semibold text-gray-700'>
          {user.name}
        </h1>
        <p className='text-14 truncate font-normal text-gray-600'>
          {user.email}
        </p>
      </div>

      <div onClick={handleLogout} className='footer_image'>
        <Image src={'/icons/logout.svg'} fill alt='logout icon' />
      </div>
    </footer>
  );
}
