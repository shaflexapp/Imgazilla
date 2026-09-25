import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { EventType } from '@/eventType';

import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { convertToImageUrl } from '@/app/lib/convertToImageUrl';
import {
  EmptyImageSelector,
  FaviconPreviewSheet,
  ImagePreview,
} from '@/app/components';

import { useTypedDispatch } from '@/app/redux/store';
import { getFaviconImageData, updateSelectedImage } from '@/app/redux/features';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';
import { ANALYTIC_EVENTS, PNG_FORMAT } from '@/app/constants';
import { cn } from '@/app/lib/utils';

const SELECTION_HINT = 'Select a single square frame or image';

const SELECTION_ISSUES: Record<string, string> = {
  [EventType.MULTIPLE_NODES_SELECTED_ERROR]: 'Multiple layers are selected.',
  [EventType.NON_SQUARE_NODE_SELECTED_ERROR]:
    'The selected layer is not square.',
  [EventType.SELECTION_CLEARED]: 'Nothing is selected.',
};

export const FaviconPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionIssue, setSelectionIssue] = useState<string | null>(null);

  const imageData = useSelector(getFaviconImageData);
  const trackClick = useMixpanel();

  // Memoized so re-rendering the selection hint doesn't create new blob URLs.
  const imageUrl = useMemo(
    () => (imageData ? convertToImageUrl(imageData, PNG_FORMAT) : undefined),
    [imageData],
  );

  const dispatch = useTypedDispatch();

  const handleFigmaPluginMessages = useCallback((message: MessageType) => {
    if (message?.type === EventType.IMAGE_UNIT_ARRAY_DATA) {
      dispatch(updateSelectedImage(message.payload?.data));
      setSelectionIssue(null);
    }

    if (Object.prototype.hasOwnProperty.call(SELECTION_ISSUES, message?.type)) {
      setSelectionIssue(message.type);
    }
  }, []);

  const handleOnOpenModal = useCallback((open: boolean) => {
    trackClick('click', {
      name: ANALYTIC_EVENTS.OPEN_FAVICON_PREVIEW,
    });

    setIsOpen(open);
  }, []);

  useWindowMessaging(handleFigmaPluginMessages);

  // Without an image the empty state already asks for a selection.
  const isShowSelectionHint =
    selectionIssue !== null &&
    (Boolean(imageData) || selectionIssue !== EventType.SELECTION_CLEARED);

  return (
    <div className='flex flex-col items-center justify-between p-3'>
      <div className='flex flex-col items-center my-11'>
        {imageData ? (
          <ImagePreview imageUrl={imageUrl} />
        ) : (
          <EmptyImageSelector />
        )}
        {isShowSelectionHint ? (
          <div
            role='status'
            className={cn(
              'flex flex-col items-center gap-1 text-center text-xs',
              imageData ? '-mt-3' : 'mt-3',
            )}
          >
            <p className='text-primary-lightYellow'>
              {SELECTION_ISSUES[selectionIssue]} {SELECTION_HINT}.
            </p>
            {imageData ? (
              <p className='text-primary-gray'>
                The preview and export use your last valid selection.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <FaviconPreviewSheet
        isOpen={isOpen}
        onOpenChange={handleOnOpenModal}
        isDisabled={!imageData}
      />
    </div>
  );
};
