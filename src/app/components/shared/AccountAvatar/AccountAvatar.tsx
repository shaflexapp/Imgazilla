'use client';

import React, { useMemo } from 'react';

import { Avatar, AvatarFallback } from '@/app/components';

type Props = {
  url?: string;
  alt: string;
  name?: string;
};

export const AccountAvatar = ({ url, alt, name = 'imgazilla' }: Props) => {
  const fallback = useMemo(() => name?.slice(0, 2), [name]);

  return (
    <Avatar className='w-6 h-6 overflow-hidden rounded-full ml-2.5'>
      {url ? (
        <img src={url} alt={alt} />
      ) : (
        <AvatarFallback className='w-6 h-6 overflow-hidden rounded-full ml-2.5'>
          {fallback}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
