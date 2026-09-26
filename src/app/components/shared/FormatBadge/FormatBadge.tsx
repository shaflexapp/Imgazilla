import { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';
import {
  SVG_FORMAT,
  PNG_FORMAT,
  JPG_FORMAT,
  PDF_FORMAT,
  WEB_P_FORMAT,
  AVIF_FORMAT,
} from '@/app/constants';

type Props = {
  children: ReactNode;
  format: string;
};

export const FormatBadge = ({ format, children }: Props) => {
  const formatMap = {
    [SVG_FORMAT]:
      'text-primary-green/75 bg-primary-green/20 border border-primary-green/20',
    [PNG_FORMAT]:
      'text-primary-lightBlue/75 bg-primary-lightBlue/20 border border-primary-lightBlue/20',
    [JPG_FORMAT]:
      'text-primary-lightYellow/75 bg-primary-lightYellow/20 border border-primary-lightYellow/20',
    [PDF_FORMAT]:
      'text-primary-lightRed/75 bg-primary-lightRed/20 border border-primary-lightRed/20',
    [WEB_P_FORMAT]:
      'text-primary-lightRed/75 bg-primary-lightRed/20 border border-primary-lightRed/20',
    [AVIF_FORMAT]:
      'text-primary-brightCyan/75 bg-primary-brightCyan/20 border border-primary-brightCyan/20',
  };

  return (
    <div
      className={cn(
        'flex rounded-sm px-2 py-0.5 font-semibold',
        formatMap[format],
      )}
    >
      {children}
    </div>
  );
};
