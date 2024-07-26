'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import {
  createLinkToken,
  exchangePublicToken,
} from '@/lib/actions/user.actions';
import { toast } from 'react-toastify';
import Loader from './Loader';
import Image from 'next/image';

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
  const [token, setToken] = useState<string>('');
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      return data.linkToken;
    };
    getLinkToken().then((linkToken) => setToken(linkToken));
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      setLoading(true);
      try {
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });

        router.push('/');
        toast.success('Bank account connected successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to connect bank account');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <>
      {isLoading && <Loader />}
      {variant === 'primary' ? (
        <Button
          onClick={() => open()}
          className='plaidlink-primary'
          disabled={!ready}
        >
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button
          onClick={() => open()}
          className='plaidlink-ghost'
          variant='ghost'
        >
          <Image
            src={'/icons/connect-bank.svg'}
            alt='connect bank'
            width={24}
            height={24}
          />
          <p className='text-[16px] font-semibold text-black-2 hidden xl:inline-block'>
            Connect bank
          </p>
        </Button>
      ) : (
        <Button onClick={() => open()} className='plaidlink-default'>
          <Image
            src={'/icons/connect-bank.svg'}
            alt='connect bank'
            width={24}
            height={24}
          />
          <p className='text-[16px] font-semibold text-black-2'>Connect bank</p>
        </Button>
      )}
    </>
  );
}
