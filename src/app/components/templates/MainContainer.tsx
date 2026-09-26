import { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};
export const MainContainer = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'flex bg-primary-secondDark rounded-lg border border-primary-primaryDark',
        className,
      )}
    >
      {children}
    </div>
  );
};
