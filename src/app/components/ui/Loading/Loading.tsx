import { LoaderCircle } from 'lucide-react';

export const Loading = () => {
  return (
    <div className='flex gap-3.5 items-center'>
      <LoaderCircle className='animate-spin' size={16} />
      <p className='text-sm'>Loading...</p>
    </div>
  );
};
