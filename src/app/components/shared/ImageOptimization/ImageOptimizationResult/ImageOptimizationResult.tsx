import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

import {
  useLazyGetAccountCreditsQuery,
  useLazyGetOptimizedImageQuery,
  useLazyGetProcessStatusQuery,
} from '@/app/redux/services';
import {
  getImageOptimizationJobId,
  getImageOptimizationResult,
  setImageOptimizationResult,
  setImageOptimizationResultPageState,
  updateAccountCredits,
} from '@/app/redux/features';
import {
  ExportButton,
  ImageOptimizationResultList,
  ImageOptimizationResultSettings,
} from '@/app/components';
import { useTypedDispatch } from '@/app/redux/store';
import { ANALYTIC_EVENTS, ARCHIVE_NAME_OPTIMIZATION } from '@/app/constants';
import { generateImagesArchive } from '@/app/lib/generateArchive';
import {
  getJobErrorMessage,
  getJobStatus,
  isJobResultSuccessful,
  JOB_POLLING_INTERVAL,
  JOB_SLOW_NOTICE_DELAY,
  JOB_SLOW_NOTICE_MESSAGE,
  JOB_STATUS,
} from '@/app/lib/jobPolling';
import { useMixpanel } from '@/app/hooks/useMixpanleAnalytics';

export const ImageOptimizationResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(JOB_POLLING_INTERVAL);
  const isJobFailedRef = useRef(false);

  const imageOptimizationResult = useSelector(getImageOptimizationResult);
  const jobId = useSelector(getImageOptimizationJobId);

  const trackClick = useMixpanel();

  const dispatch = useTypedDispatch();

  // `currentData`/`error` belong to `lastArg`, the job last passed to
  // `getProcessStatus`, so the status is only applied when it matches `jobId`.
  const [getProcessStatus, { currentData: data, error }, { lastArg }] =
    useLazyGetProcessStatusQuery({
      pollingInterval,
    });

  const [getOptimizedImage] = useLazyGetOptimizedImageQuery();
  const [getAccountCredits] = useLazyGetAccountCreditsQuery();

  const handleOnClosePageResult = useCallback(() => {
    dispatch(setImageOptimizationResultPageState({ isOpen: false }));
    dispatch(setImageOptimizationResult({ result: [] }));
  }, [dispatch, setImageOptimizationResultPageState]);

  const handleOnJobError = useCallback(
    (description: string) => {
      isJobFailedRef.current = true;
      setPollingInterval(0);
      toast('Error', {
        description,
      });
      setIsLoading(false);
      handleOnClosePageResult();
    },
    [handleOnClosePageResult],
  );

  const handleOnDownload = useCallback(async () => {
    const fileName = `${ARCHIVE_NAME_OPTIMIZATION}-${DateTime.now().toFormat('yyyy-MM-dd-HH-mm-ss')}.zip`;

    trackClick('click', {
      name: ANALYTIC_EVENTS.DOWNLOAD_IMAGES_ARCHIVE,
    });

    const blobPath = await generateImagesArchive(
      imageOptimizationResult,
      fileName,
    );
    saveAs(blobPath, fileName);
  }, [imageOptimizationResult]);

  useEffect(() => {
    if (isLoading || imageOptimizationResult.length > 0) {
      return;
    }

    getProcessStatus(jobId);
    setIsLoading(true);
  }, [jobId, imageOptimizationResult]);

  // The job is already paid for: keep polling it (also after switching tabs
  // and coming back) and only let the user know it is slow.
  useEffect(() => {
    if (!jobId || imageOptimizationResult.length > 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      toast.info('Still processing', {
        description: JOB_SLOW_NOTICE_MESSAGE,
      });
    }, JOB_SLOW_NOTICE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [jobId, imageOptimizationResult.length]);

  useEffect(() => {
    if (imageOptimizationResult.length > 0 || lastArg !== jobId) {
      return;
    }

    const jobStatus = getJobStatus(data, error);

    if (jobStatus === JOB_STATUS.PROCESSING) {
      return;
    }

    setPollingInterval(0);

    if (jobStatus !== JOB_STATUS.COMPLETED) {
      handleOnJobError(getJobErrorMessage(jobStatus, data, error));
      return;
    }

    getOptimizedImage(jobId)
      .unwrap()
      .then((response) => {
        // The job was already reported as failed and the page was closed.
        if (isJobFailedRef.current) {
          return;
        }

        const result = response?.result;

        if (
          !isJobResultSuccessful(response) ||
          !Array.isArray(result) ||
          result.length === 0
        ) {
          handleOnJobError(
            getJobErrorMessage(JOB_STATUS.FAILED, response ?? undefined),
          );
          return;
        }

        dispatch(setImageOptimizationResult({ result }));
        getAccountCredits('')
          .unwrap()
          .then((credits: string) => {
            dispatch(updateAccountCredits({ credits }));
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        handleOnJobError('Something went wrong, please try again!');
      });
  }, [data, error, jobId, lastArg]);

  return (
    <div className='flex flex-col relative w-full'>
      <ImageOptimizationResultSettings
        onClick={handleOnClosePageResult}
        isDisabled={isLoading}
      />
      <ImageOptimizationResultList isLoading={isLoading} />
      <ExportButton onClick={handleOnDownload} isDisabled={isLoading}>
        Download images package
      </ExportButton>
    </div>
  );
};
