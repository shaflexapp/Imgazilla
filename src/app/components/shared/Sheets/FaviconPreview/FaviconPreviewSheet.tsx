import {
  Button,
  FaviconBrowsePreview,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/app/components';

type Props = {
  isOpen: boolean;
  isDisabled: boolean;
  onOpenChange: (open: boolean) => void;
};

export const FaviconPreviewSheet = ({
  isOpen,
  onOpenChange,
  isDisabled,
}: Props) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant='outline' disabled={isDisabled} className='px-10'>
          Browse preview
        </Button>
      </SheetTrigger>
      <SheetContent side='bottom'>
        <FaviconBrowsePreview />
      </SheetContent>
    </Sheet>
  );
};
