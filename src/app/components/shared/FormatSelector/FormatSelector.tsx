import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  AVIF_FORMAT,
  JPG_FORMAT,
  PNG_FORMAT,
  SVG_FORMAT,
  WEB_P_FORMAT,
} from '@/app/constants';
import { Button, FormatBadge } from '@/app/components';
import { cn } from '@/app/lib/utils';

interface Option {
  label: string;
  color: string;
  value: string;
}

const formatOptions: Option[] = [
  { value: PNG_FORMAT, label: PNG_FORMAT, color: 'bg-primary-lightBlue' },
  { value: SVG_FORMAT, label: SVG_FORMAT, color: 'bg-primary-green' },
  { value: JPG_FORMAT, label: JPG_FORMAT, color: 'bg-primary-lightYellow' },
  { value: WEB_P_FORMAT, label: WEB_P_FORMAT, color: 'bg-primary-redLight' },
  { value: AVIF_FORMAT, label: AVIF_FORMAT, color: 'bg-primary-brightCyan' },
];

type Props = {
  defaultFormat: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  forceClose?: boolean;
};

export const FormatSelector = ({
  defaultFormat,
  isDisabled,
  onChange,
  forceClose,
}: Props) => {
  const [selectedFormat, setSelectedFormat] = useState<Option | undefined>(
    formatOptions.find((option) => option.label === defaultFormat),
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = useCallback((option: Option) => {
    setSelectedFormat(option);
    onChange(option.value);
    setIsOpen(false);
  }, []);

  const handleIsOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (forceClose) {
      setIsOpen(false);
      return;
    }
  }, [forceClose]);

  // Export settings such as PDF can't be converted to another format,
  // so they are shown read-only and exported as is.
  if (!selectedFormat) {
    return (
      <div
        className='flex flex-row justify-center items-center min-w-32 rounded-lg border border-primary-primaryDark bg-primary-mainDark px-3 py-2 text-sm'
        title='This format is exported as is'
      >
        <FormatBadge format={defaultFormat}>
          {defaultFormat || 'Unknown'}
        </FormatBadge>
      </div>
    );
  }

  return (
    <div className='relative inline-block text-left min-w-32'>
      <Button
        variant='dark'
        onClick={handleIsOpen}
        disabled={isDisabled}
        className='flex flex-row justify-center items-center gap-2.5 rounded-lg border border-primary-primaryDark px-3 py-2 text-sm h-auto!'
      >
        <FormatBadge format={selectedFormat.value}>
          {selectedFormat.label}
        </FormatBadge>
        <div className='flex bg-primary-secondDark border border-primary-primaryDark rounded px-1.5 py-1'>
          {isOpen ? (
            <ChevronUp className='stroke-input' size={16} />
          ) : (
            <ChevronDown className='stroke-input' size={16} />
          )}
        </div>
      </Button>
      {isOpen && (
        <div className='absolute flex flex-col left-0 z-10 mt-2 origin-top-left px-2 py-2 bg-primary-mainDark rounded-lg border border-primary-primaryDark w-full gap-1.5'>
          {formatOptions.map((option) => (
            <div
              key={option.label}
              onClick={() => handleSelection(option)}
              className={cn(
                'flex items-center p-1 cursor-pointer border border-transparent rounded hover:bg-primary-secondDark hover:border-primary-primaryDark',
                { 'bg-gray-800': selectedFormat.label === option.label },
              )}
            >
              <span className={cn('w-2 h-2 mr-2 rounded-full', option.color)} />
              <span className='text-primary-gray font-semibold'>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
