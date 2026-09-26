import { useCallback, useMemo, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { type SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { SyntaxHighlighter } from '@/app/lib/syntaxHighlighter';
import vscDarkPlus from '@/app/styles/code-styles';

import { AnimatedTooltip, Button, Sheet, SheetContent } from '@/app/components';
import { headTag, getHtmlSnippet } from '@/app/utils/code-template';
import { useClipboardCommand } from '@/app/hooks/useClipboardCommand';
import { getFaviconSettings } from '@/app/redux/features';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
};

export const FaviconExporterSheet = ({
  open,
  onOpenChange,
  onDownload,
}: Props) => {
  const elementToCopyRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { copyText, textareaRef } = useClipboardCommand();

  const {
    themeColor,
    websiteName,
    platforms: { ios, android },
  } = useSelector(getFaviconSettings);

  const handleOnCloseTooltip = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  }, []);

  const handleOnCopy = useCallback(async () => {
    copyText(
      getHtmlSnippet({
        color: themeColor,
        isIOS: ios,
        isAndroid: android,
        websiteName,
      })
        .join('')
        .trim(),
    );
    setIsOpen(true);
    handleOnCloseTooltip();
  }, [themeColor, websiteName, ios, android]);

  const htmlSnippet = useMemo(
    () =>
      getHtmlSnippet({
        color: themeColor,
        isIOS: ios,
        isAndroid: android,
        websiteName,
      }).join(''),
    [themeColor, websiteName, ios, android],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom'>
        <div className='flex text-sm font-normal'>
          Insert the following code in the{' '}
          <span className='text-primary-code px-2'>{headTag}</span> section of
          your pages:
        </div>
        <SyntaxHighlighter
          language='javascript'
          // code-styles holds plain strings (e.g. direction: 'ltr'), which TS widens to string
          style={vscDarkPlus as SyntaxHighlighterProps['style']}
        >
          {htmlSnippet}
        </SyntaxHighlighter>
        <div ref={elementToCopyRef} className='hidden'>
          {htmlSnippet}
        </div>
        <div className='flex justify-between mt-3'>
          <AnimatedTooltip isOpen={isOpen}>
            <Button variant='outline' className='px-10' onClick={handleOnCopy}>
              Copy to clipboard
            </Button>
          </AnimatedTooltip>
          <Button onClick={onDownload}>Download favicons package (zip)</Button>
        </div>
        <textarea
          ref={textareaRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            height: '1px',
            top: '0',
            opacity: '0',
          }}
          readOnly
        />
      </SheetContent>
    </Sheet>
  );
};
