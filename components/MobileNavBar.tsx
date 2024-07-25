'use client';

import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Footer from './Footer';

export default function MobileNavBar({ user }: MobileNavProps) {
  const pathName = usePathname();

  return (
    <section className=' max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image
            src={'/icons/hamburger.svg'}
            width={30}
            height={30}
            alt='menu'
            className='cursor-pointer'
          />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-slate-50'>
          <SheetTitle className='hidden'>Navbar</SheetTitle>
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
          <div className='mobilenav-sheet'>
            <SheetClose asChild>
              <nav className='flex h-full flex-col gap-6 pt-16 text-slate-50'>
                {sidebarLinks.map((link) => {
                  const isActive =
                    pathName === link.route ||
                    pathName.startsWith(`${link.route}/`);
                  return (
                    <SheetClose asChild key={link.label}>
                      <Link
                        href={link.route}
                        className={cn('mobilenav-sheet_close w-full', {
                          'bg-bankGradient': isActive,
                        })}
                      >
                        <Image
                          src={link.imgURL}
                          width={20}
                          height={20}
                          alt={link.label}
                          className={cn({
                            'brightness-[3] invert-0': isActive,
                          })}
                        />

                        <p
                          className={cn('text-16 font-semibold text-black-2', {
                            '!text-slate-50': isActive,
                          })}
                        >
                          {link.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
            <Footer user={user} type='mobile' />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
