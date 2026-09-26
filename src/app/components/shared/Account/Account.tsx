import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { getAccount } from '@/app/redux/features';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  InstructionSheet,
  EarnCreditsSheet,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  AccountAvatar,
} from '@/app/components';
import { cn } from '@/app/lib/utils';

export const Account = () => {
  const [isOpen, setIsOpen] = useState(false);
  const accountDetails = useSelector(getAccount);

  const isLongCount = accountDetails.credits?.length >= 4;

  return (
    <div className='flex'>
      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div className='flex gap-2 items-center bg-primary-secondDark py-2 px-3 rounded-lg border border-primary-primaryDark relative'>
            <div className='flex gap-1 items-center'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='p-0 h-fit' asChild>
                    <p
                      className={cn(
                        'font-bold truncate max-w-[121px]',
                        isLongCount ? 'text-xs' : 'text-sm',
                      )}
                    >
                      {accountDetails.credits}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p className='font-bold text-sm'>
                      {accountDetails.credits}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='text-sm'>credits</p>
              <AccountAvatar
                url={accountDetails.photoUrl}
                alt={accountDetails.name}
                name={accountDetails.name}
              />
            </div>
            {isOpen ? (
              <ChevronUp className='stroke-input' size={14} />
            ) : (
              <ChevronDown className='stroke-input' size={14} />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={6}
          className='flex flex-col shadow-custom items-start bg-primary-mainDark rounded-lg border border-primary-primaryDark w-full py-2 px-3'
        >
          <EarnCreditsSheet />
          <InstructionSheet />
        </PopoverContent>
      </Popover>
    </div>
  );
};
