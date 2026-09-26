import { useSelector } from 'react-redux';
import { getFaviconSettings } from '@/app/redux/features';
import { cn } from '@/app/lib/utils';

type Props = {
  imageUrl: string;
};

export const ImagePreview = ({ imageUrl }: Props) => {
  const formSettings = useSelector(getFaviconSettings);

  const isBackgroundColor = formSettings?.bgColor !== '';

  return (
    <div className='flex flex-col justify-center items-center mb-[29px]'>
      <div className='flex'>
        <div className='flex justify-center items-center w-previewSquareWidth h-previewSquareHeight mb-[3px]'>
          <img
            src={imageUrl}
            alt='Preview favicon image'
            className={cn(
              'w-previewSquareWidth h-previewSquareHeight border border-borderSquare preview',
              isBackgroundColor ? 'bg-none' : '',
            )}
            style={{ backgroundColor: formSettings.bgColor }}
          />
        </div>
        <div className='ml-[5px]'>
          <div className='flex justify-center items-center w-[32px] h-[32px] mb-[3px]'>
            <img
              src={imageUrl}
              alt='Preview favicon image'
              className={cn(
                'w-[32px] h-[32px] border border-borderSquare preview',
                isBackgroundColor ? 'bg-none' : '',
              )}
              style={{ backgroundColor: formSettings.bgColor }}
            />
          </div>
          <div className='flex justify-center items-center w-[48px] h-[48px] mb-[3px]'>
            <img
              src={imageUrl}
              alt='Preview favicon image'
              className={cn(
                'w-[48px] h-[48px] border border-borderSquare preview',
                isBackgroundColor ? 'bg-none' : '',
              )}
              style={{ backgroundColor: formSettings.bgColor }}
            />
          </div>
          <div className='flex justify-center items-center w-[64px] h-[64px] mb-[3px]'>
            <img
              src={imageUrl}
              alt='Preview favicon image'
              className={cn(
                'w-[64px] h-[64px] border border-borderSquare preview',
                isBackgroundColor ? 'bg-none' : '',
              )}
              style={{ backgroundColor: formSettings.bgColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
