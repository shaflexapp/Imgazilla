import { useRef, useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { debounce } from 'lodash';

import { useClickOutside } from '@/app/hooks/useClickOutside';
import { cn, validateAndFormatHexColor } from '@/app/lib/utils';
import { Button } from '@/app/components';

type Props = {
  color?: string;
  onChange: (value: string) => void;
  onSelectHistoryColor: (value: string) => void;
  className?: string;
  history: string[];
};

export const ColorPicker = ({
  color,
  onChange,
  history,
  onSelectHistoryColor,
}: Props) => {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);

  // Derived synchronously so the + button can never submit an invalid value,
  // even while the debounced error highlighting is still pending.
  const validatedValue = useMemo(
    () => validateAndFormatHexColor(value),
    [value],
  );
  const isDisabled = !validatedValue;

  const popover = useRef<HTMLDivElement>(null);

  const [isOpen, toggle] = useState(false);

  const handleOnOpen = useCallback(() => toggle(true), []);

  const handleOnClose = useCallback(() => toggle(false), []);

  const handleColorChange = useCallback((value: string) => {
    setIsError(value !== '' && !validateAndFormatHexColor(value));
  }, []);

  const debouncedHandleColorChange = useCallback(
    debounce(handleColorChange, 300),
    [],
  );

  const handleOnChange = useCallback((e) => {
    const value = e.target.value;
    setValue(value);
    debouncedHandleColorChange(value);
  }, []);

  const handleOnSubmit = useCallback(() => {
    if (!validatedValue) {
      return;
    }

    onChange(validatedValue);
    handleOnClose();
  }, [validatedValue, onChange]);

  const handleOnSelectHistoryColor = useCallback((color: string) => {
    setValue('');
    onSelectHistoryColor(color);
    handleOnClose();
  }, []);

  useClickOutside(popover, handleOnClose);

  return (
    <div>
      <div
        style={{ backgroundColor: color }}
        className={cn(
          'flex relative justify-center items-center h-5 w-5 border border-primary-primaryDark rounded-md hover:cursor-pointer',
          color ? `bg-[${color}]` : 'bg-white',
        )}
        onClick={handleOnOpen}
      >
        {!color ? (
          <div className='w-[17px] h-[1px] bg-red-600 -rotate-45' />
        ) : null}
      </div>
      {isOpen ? (
        <div
          ref={popover}
          className='w-full absolute top-8 z-10 bg-primary-darkGray border border-primary-primaryDark rounded-lg'
        >
          <ul className='flex p-3 border-b border-primary-primaryDark gap-1.5'>
            <li
              className='flex relative justify-center items-center h-4 w-4 border border-primary-primaryDark rounded-md hover:cursor-pointer bg-white'
              onClick={() => handleOnSelectHistoryColor('')}
            >
              <span className='w-[12px] h-[1px] bg-red-600 -rotate-45' />
            </li>
            {history
              ? history.map((item) => {
                  const isEqual =
                    item?.toLowerCase() === validatedValue?.toLowerCase() ||
                    item?.toLowerCase() === color?.toLowerCase();
                  return (
                    <li
                      key={item}
                      style={{ backgroundColor: item }}
                      className={cn(
                        'flex relative justify-center items-center h-4 w-4 p-0.5 border border-primary-primaryDark rounded-md hover:cursor-pointer',
                        isEqual ? 'animate-move-up' : null,
                      )}
                      onClick={() => handleOnSelectHistoryColor(item)}
                    />
                  );
                })
              : null}
          </ul>
          <div className='flex justify-between items-center p-3 gap-1'>
            <p className='text-sm text-primary-gray'>Custom color</p>
            <div className='flex gap-2'>
              <div
                className={cn(
                  'flex items-center justify-between gap-2 px-1 py-1 bg-primary-mainDark rounded-md border border-primary-primaryDark',
                  isError ? 'border-red-500' : 'border-primary-primaryDark',
                )}
              >
                <div
                  style={{ backgroundColor: isError ? '' : value }}
                  className={`flex relative justify-center items-center h-4 w-4 p-0.5 border border-primary-primaryDark rounded-md bg-[${value}]`}
                />
                <input
                  type='text'
                  placeholder='hex color'
                  className='bg-primary-mainDark focus:outline-none rounded-md max-w-20 placeholder:text-sm placeholder:text-gray-700'
                  value={value}
                  onChange={handleOnChange}
                />
              </div>
              <Button
                className='h-auto p-1 rounded-md bg-primary-darkGreen border border-primary-primaryDark hover:bg-primary-darkGreen/90'
                type='button'
                disabled={isDisabled}
                onClick={handleOnSubmit}
              >
                <Plus className='stroke-primary-lightGreen' />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
