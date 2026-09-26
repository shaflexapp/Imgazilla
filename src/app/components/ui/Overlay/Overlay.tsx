import React from 'react';
import { Loading } from '@/app/components';

type Props = {
  children?: React.ReactNode;
};

export const Overlay = ({ children = <Loading /> }: Props) => {
  return (
    <div className='fixed inset-0 top-0 bg-black/50 z-50'>
      <div className='flex justify-center items-center h-full'>{children}</div>
    </div>
  );
};
