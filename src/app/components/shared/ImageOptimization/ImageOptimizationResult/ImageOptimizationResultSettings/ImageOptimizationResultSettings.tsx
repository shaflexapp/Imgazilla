import { CircleChevronLeft } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components';

type Props = {
  onClick: () => void;
  isDisabled?: boolean;
};

export const ImageOptimizationResultSettings = ({
  onClick,
  isDisabled = false,
}: Props) => {
  return (
    <div className='border border-primary-primaryDark bg-primary-secondDark rounded-lg'>
      <div className='flex justify-end mx-3 my-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={onClick}
              disabled={isDisabled}
              type='button'
            >
              <CircleChevronLeft size={20} />
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>Back to images list</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
