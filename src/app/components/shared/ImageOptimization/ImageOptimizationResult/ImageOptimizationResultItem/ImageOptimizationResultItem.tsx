import { cn } from '@/app/lib/utils';
import { FORMAT_TO_MIME_TYPE, WEB_P_FORMAT } from '@/app/constants';
import { FormatBadge } from '@/app/components';
import { MoveRight } from 'lucide-react';

type Props = {
  item: ImageOptimizationResult;
  className?: string;
};

export const ImageOptimizationResultItem = ({ item, className }: Props) => {
  const { name, sourceImageSize, format, optimizedImageSize } = item;

  //TODO: Update all file format to one format as backend.
  const fileFormat =
    format === 'webp' ? WEB_P_FORMAT : String(format ?? '').toUpperCase();
  const mimeType =
    FORMAT_TO_MIME_TYPE[fileFormat] ??
    `image/${format === 'jpg' ? 'jpeg' : format}`;

  const isShowSourceSize =
    optimizedImageSize.toFixed(2) <= sourceImageSize.toFixed(2);

  return (
    <div
      className={cn(
        'flex flex-col border bg-primary-mainDark border-primary-primaryDark w-full',
        className,
      )}
    >
      <div className='flex items-center justify-between gap-5 py-2.5 space-x-4 px-3 w-full'>
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 bg-gray-200 flex items-center justify-center overflow-hidden preview rounded-md'>
            <img
              src={`data:${mimeType};base64,${item.base64Image}`}
              alt={name}
              className='rounded-md min-w-full min-h-full object-cover'
            />
          </div>
          <div className='flex w-64'>
            <p className='truncate'>{name}</p>
          </div>
        </div>
        <div className='flex gap-1 items-center'>
          {isShowSourceSize ? (
            <>
              <div className='flex text-sm text-primary-gray'>
                <p>{sourceImageSize.toFixed(2)}</p>
                <p>KB</p>
              </div>
              <MoveRight className='stroke-primary-lightGreen' size={16} />
            </>
          ) : null}
          <div className='flex font-bold text-sm text-primary-strongGreen'>
            <p>{optimizedImageSize.toFixed(2)}</p>
            <p>KB</p>
          </div>
        </div>
        <div className='flex text-xs'>
          <FormatBadge format={fileFormat}>{fileFormat}</FormatBadge>
        </div>
      </div>
    </div>
  );
};
