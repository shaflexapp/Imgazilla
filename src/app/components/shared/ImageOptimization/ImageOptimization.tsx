import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { toast } from 'sonner';

import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
import { EventType, UIEventType } from '@/eventType';
import { useTypedDispatch } from '@/app/redux/store';
import {
  FAVICON_TAB,
  getGeneralOptimizationPercent,
  getImages,
  getIsImageOptimizationResultsOpen,
  getIsSingleMode,
  getSelectedImages,
  reset,
  setDisableTab,
  setImageOptimizationJobId,
  setImageOptimizationResultPageState,
  setImagesForOptimization,
} from '@/app/redux/features';

import {
  Overlay,
  ImageOptimizationSettings,
  ImageOptimizationList,
  ExportButton,
  ImageOptimizationResult,
  EarnCreditsSheet,
} from '@/app/components';
import { useOptimizeImageMutation } from '@/app/redux/services';
import { transformAndCompressData } from '@/app/lib/compressData';
import { APP_ROUTES_PATHS, IMAGE_OPTIMIZATION } from '@/app/constants';

export const ImageOptimization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHideScrollTo, setIsHideScrollTo] = useState(false);
  const [isOptimizationStarted, setIsOptimizationStarted] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [optimizeImage] = useOptimizeImageMutation();
  const navigate = useNavigate();

  const dispatch = useTypedDispatch();

  const isImageOptimizationResultsOpen = useSelector(
    getIsImageOptimizationResultsOpen,
  );
  const generalOptimizationPercent = useSelector(getGeneralOptimizationPercent);
  const selectedImages = useSelector(getSelectedImages);
  const images = useSelector(getImages);
  const isSingleMode = useSelector(getIsSingleMode);

  const onOptimizeImage = useCallback(() => {
    setIsOptimizationStarted(true);
    setIsLoading(true);
    optimizeImage(transformAndCompressData(selectedImages))
      .unwrap()
      .then(({ jobId }: { jobId: string }) => {
        dispatch(setImageOptimizationJobId({ jobId }));
        dispatch(setImageOptimizationResultPageState({ isOpen: true }));
      })
      .catch((error) => {
        toast.info('Error while image optimization', {
          description: error?.data?.message,
          action: {
            label: 'Purchase',
            onClick: () => setIsOpenModal(true),
          },
          duration: 5000,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setIsOptimizationStarted(false);
      });
  }, [selectedImages, generalOptimizationPercent]);

  const onFetchImageCollection = useCallback(() => {
    setIsLoading(true);

    onSendMessage({
      type: UIEventType.GET_IMAGES_UINT_ARRAY_COLLECTION,
      payload: {},
    });
  }, []);

  const onCheckSelectedImages = useCallback(() => {
    setIsLoading(true);

    onSendMessage({
      type: UIEventType.GET_SELECTED_IMAGES_UINT_ARRAY,
      payload: {},
    });
  }, []);

  const handleOnOpenChange = useCallback((isOpen: boolean) => {
    setIsOpenModal(isOpen);
  }, []);

  const onDisableTab = useCallback((isDisabled: boolean = true) => {
    dispatch(setDisableTab({ name: FAVICON_TAB, isDisabled }));
  }, []);

  const handleOnBack = useCallback(() => {
    dispatch(reset());
    setIsHideScrollTo(false);
    navigate(`/${APP_ROUTES_PATHS[IMAGE_OPTIMIZATION]}`);
  }, [navigate]);

  const handleOnRefreshPage = useCallback(() => {
    dispatch(reset());
    handleOnFetchImageCollection();
  }, []);

  const handleOnRefreshSelectedNode = useCallback(() => {
    dispatch(reset());
    setIsHideScrollTo(false);
    onDisableTab();
    onCheckSelectedImages();
  }, []);

  const handleOnFetchImageCollection = useCallback(() => {
    onDisableTab();
    setIsHideScrollTo(false);
    onFetchImageCollection();
  }, []);

  const handleFigmaPluginMessages = useCallback(
    (message: MessageType) => {
      if (message?.type === EventType.IMAGES_UINT_ARRAY_COLLECTION) {
        dispatch(setImagesForOptimization(message.payload.data));
      }

      if (
        message?.type === EventType.IMAGE_COLLECTION_COMPLETE ||
        message?.type === EventType.SELECTED_IMAGES_COLLECTION_COMPLETE
      ) {
        setIsLoading(false);
        onDisableTab(false);
      }

      if (message?.type === EventType.SELECTED_IMAGES_COLLECTION) {
        dispatch(setImagesForOptimization(message.payload.data));
      }
    },
    [handleOnFetchImageCollection],
  );

  const handleOnRefresh = useCallback(() => {
    if (isSingleMode) {
      handleOnRefreshSelectedNode();
      return;
    }
    handleOnRefreshPage();
  }, [isSingleMode, handleOnRefreshSelectedNode, handleOnRefreshPage]);

  const { onSendMessage } = useWindowMessaging(handleFigmaPluginMessages);

  const isDisabled = selectedImages.length === 0;

  useEffect(() => {
    if (images.length !== 0) {
      return;
    }

    if (isSingleMode) {
      onCheckSelectedImages();
      return;
    }

    onFetchImageCollection();
  }, [onCheckSelectedImages, onFetchImageCollection, isSingleMode]);

  return (
    <>
      {isImageOptimizationResultsOpen ? (
        <ImageOptimizationResult />
      ) : (
        <>
          <div className='flex flex-col relative w-full'>
            <ImageOptimizationSettings onRefresh={handleOnRefresh} />
            <ImageOptimizationList
              data={images}
              isLoading={isLoading}
              isHideScrollTo={isHideScrollTo}
              onUpdateScrollTo={setIsHideScrollTo}
            />
            <ExportButton
              onBack={handleOnBack}
              onClick={onOptimizeImage}
              isOptimizationStarted={isOptimizationStarted}
              isDisabled={isDisabled || isOptimizationStarted}
            >
              Optimize {selectedImages.length} images
            </ExportButton>
            <EarnCreditsSheet
              showTrigger={false}
              isOpen={isOpenModal}
              onOpenChange={handleOnOpenChange}
            />
          </div>
          {isLoading ? <Overlay /> : null}
        </>
      )}
    </>
  );
};
