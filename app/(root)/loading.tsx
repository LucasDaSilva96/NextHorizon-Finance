import { LoaderCircle } from 'lucide-react';
import React from 'react';

export default function Loader() {
  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center backdrop-blur-lg'>
      <LoaderCircle className='animate-spin' />
    </div>
  );
}
