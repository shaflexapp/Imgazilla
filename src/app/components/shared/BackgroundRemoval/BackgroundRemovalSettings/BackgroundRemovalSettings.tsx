import { RefreshCcw } from 'lucide-react';

import { Button } from '@/app/components';

type Props = {
  onRefresh: () => void;
};

export const BackgroundRemovalSettings = ({ onRefresh }: Props) => {
  return (
    <div className='border border-primary-primaryDark bg-primary-secondDark rounded-lg'>
      <div className='flex justify-end mx-3 my-3'>
        <div className='flex items-center'>
          <Button
            variant='dark'
            onClick={onRefresh}
            className='flex flex-row justify-center items-center gap-2.5 rounded-lg border border-primary-primaryDark px-3 py-2 text-sm !h-10'
          >
            <p>Sync</p>
            <RefreshCcw size={16} className='stroke-borderSquare' />
          </Button>
        </div>
      </div>
    </div>
  );
};
