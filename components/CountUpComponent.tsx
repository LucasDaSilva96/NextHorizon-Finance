'use client';
import React from 'react';
import CountUp from 'react-countup';

type CountUpComponentProps = {
  end: number;
  duration: number;
  decimal?: string;
  prefix?: string;
  decimals?: number;
};

export default function CountUpComponent({
  duration,
  end,
  decimal,
  prefix,
  decimals,
}: CountUpComponentProps) {
  return (
    <CountUp
      className='w-full'
      end={end}
      duration={duration}
      decimal={decimal ? decimal : ','}
      prefix={prefix ? prefix : '$'}
      decimals={decimals ? decimals : 2}
    />
  );
}
