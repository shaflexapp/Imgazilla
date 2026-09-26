import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { saveAs } from 'file-saver';
import { DateTime } from 'luxon';
import { encode } from 'base64-arraybuffer-es6';
import { toast } from 'sonner';

import {
  EarnCreditsSheet,
  FaviconExporterSheet,
  FaviconSettingsForm,
  FormDataType,
  Overlay,
} from '@/app/components';

import { useTypedDispatch } from '@/app/redux/store';
import {
  getFaviconImageData,
  updateAccountCredits,
  updateFaviconSettings,
} from '@/app/redux/features';
import {
  useGenerateFaviconMutation,
  useLazyGetAccountCreditsQuery,
} from '@/app/redux/services';

import { generateArchive, type ImageObject } from '@/app/lib/generateArchive';
import { ANALYTIC_EVENTS, ARCHIVE_NAME } from '@/app/constants';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

export const FaviconExporterSettings = () => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [blobPath, setBlobPath] = useState<Blob>();
  const imageData = useSelector(getFaviconImageData);

  const [generateFavicon, { isLoading }] = useGenerateFaviconMutation();
  const [getAccountCredits] = useLazyGetAccountCreditsQuery();

  const trackClick = useMixpanel();

  const dispatch = useTypedDispatch();

  const onGenerateArchive = useCallback(
    async (images: ImageObject[], formState: FormDataType) => {
      const {
        websiteName,
        themeColor,
        platforms: { android, ios },
      } = formState;
      const blob = await generateArchive({
        websiteName,
        themeColor,
        images,
        isAndroid: android,
        isIOS: ios,
      });
      setBlobPath(blob);
    },
    [],
  );

  const handleOnSubmit = useCallback(
    (data: FormDataType) => {
      const result = {
        image: encode(imageData as unknown as ArrayBuffer),
        ...data,
      };
      generateFavicon(result)
        .unwrap()
        .then(async (images: ImageObject[]) => {
          await onGenerateArchive(images, data);

          getAccountCredits('')
            .unwrap()
            .then((credits: string) => {
              dispatch(updateAccountCredits({ credits }));
            })
            .finally(() => {
              setIsOpenSheet(true);
            });
        })
        .catch((error) => {
          toast.info('Error while generating favicon', {
            description: error?.data?.message,
            action: {
              label: 'Purchase',
              onClick: () => setIsOpenModal(true),
            },
            duration: 5000,
          });
        });

      dispatch(
        updateFaviconSettings({
          faviconSettings: data,
        }),
      );
    },
    [imageData, onGenerateArchive],
  );

  const handleOnOpenChange = useCallback((open: boolean) => {
    setIsOpenSheet(open);
  }, []);

  const handleOnCreditModalOpenChange = useCallback((isOpen: boolean) => {
    setIsOpenModal(isOpen);
  }, []);

  const handleOnDownload = useCallback(() => {
    const fileName = `${ARCHIVE_NAME}-${DateTime.now().toFormat('yyyy-MM-dd-HH-mm-ss')}.zip`;

    trackClick('click', {
      name: ANALYTIC_EVENTS.DOWNLOAD_FAVICON_ARCHIVE,
    });

    saveAs(blobPath, fileName);
  }, [blobPath]);

  return (
    <div className='flex flex-col p-3 w-full'>
      <p className='font-semibold text-center'>Settings</p>
      <FaviconSettingsForm onSubmit={handleOnSubmit} />

      <EarnCreditsSheet
        showTrigger={false}
        isOpen={isOpenModal}
        onOpenChange={handleOnCreditModalOpenChange}
      />
      <FaviconExporterSheet
        open={isOpenSheet}
        onOpenChange={handleOnOpenChange}
        onDownload={handleOnDownload}
      />
      {isLoading ? <Overlay /> : null}
    </div>
  );
};
