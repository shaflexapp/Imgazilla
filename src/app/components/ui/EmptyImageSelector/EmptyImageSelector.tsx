import { ImagePreviewIcon } from '@/app/components';
export const EmptyImageSelector = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center items-center w-previewSquareWidth h-previewSquareHeight border-dashed border rounded-md border-primary-lightGreen mb-4'>
        <ImagePreviewIcon />
      </div>
      <p className='text-center font-light text-primary text-xs'>
        Select a single square layer
      </p>
    </div>
  );
};
