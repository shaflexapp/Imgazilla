import { FaviconExporterSettings, FaviconPreview } from '@/app/components';

export const FaviconExporter = () => {
  return (
    <div className='flex flex-row h-full w-full gap-1.5'>
      <div className='flex justify-center shrink basis-1/2 bg-primary-secondDark border border-primary-primaryDark rounded-lg'>
        <FaviconPreview />
      </div>
      <div className='flex shrink basis-1/2 bg-primary-secondDark border border-primary-primaryDark rounded-lg'>
        <FaviconExporterSettings />
      </div>
    </div>
  );
};
