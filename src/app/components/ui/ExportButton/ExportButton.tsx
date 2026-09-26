import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/app/components';
import { cn } from '@/app/lib/utils';

type Props = {
  onClick?: () => void;
  children: ReactNode;
  isDisabled?: boolean;
  isOptimizationStarted?: boolean;
  className?: string;
  onBack?: () => void;
};

export const ExportButton = ({
  onClick,
  children,
  isDisabled = false,
  isOptimizationStarted = false,
  className,
  onBack,
}: Props) => {
  return (
    <div
      className={cn(
        'flex justify-between mt-0.5 p-3 bg-primary-secondDark rounded-lg border border-primary-primaryDark',
        className,
      )}
    >
      {onBack ? (
        <Button
          variant='dark'
          onClick={onBack}
          disabled={isOptimizationStarted}
          className='flex flex-row justify-center items-center gap-2.5 rounded-lg border border-primary-primaryDark px-3 py-2 text-sm h-10!'
        >
          <ArrowLeft size={16} className='stroke-borderSquare' />
          <p>Back</p>
        </Button>
      ) : null}
      <Button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        disabled={isDisabled}
      >
        {children}
      </Button>
    </div>
  );
};
