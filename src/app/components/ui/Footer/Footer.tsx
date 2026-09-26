import { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};

export const Footer = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'flex justify-between mt-0.5 p-3 bg-primary-secondDark rounded-lg border border-primary-primaryDark',
        className,
      )}
    >
      {children}
    </div>
  );
};
