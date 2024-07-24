'use client';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Sidebar({ user }: SiderbarProps) {
  const pathName = usePathname();
  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link
          href='/'
          className='mb-12
        cursor-pointer text-center gap-2 flex items-center'
        >
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='horizon logo'
            className='size-[24px] max-xl:size-14'
          />
          <h1 className='sidebar-logo'>NextHorizon</h1>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn('sidebar-link', { 'bg-bankGradient': isActive })}
            >
              <div className='relative size-6'>
                <Image
                  src={link.imgURL}
                  fill
                  alt={link.label}
                  className={cn({ 'brightness-[3] invert-0': isActive })}
                />
              </div>
              <p
                className={cn('sidebar-label', {
                  '!text-slate-50': isActive,
                })}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER
    </section>
  );
}
