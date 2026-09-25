export const JOB_POLLING_INTERVAL = 3000;
// Credits are charged when a job is queued, so the client never gives up on a
// job the server still reports as running: after this delay it only tells the
// user that processing takes longer than usual and keeps polling.
export const JOB_SLOW_NOTICE_DELAY = 3 * 60 * 1000;

export const JOB_STATUS = {
  COMPLETED: 'completed',
  PROCESSING: 'processing',
  FAILED: 'failed',
  NOT_FOUND: 'not_found',
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

type JobStatusResponse = {
  status?: number;
  message?: string;
  reason?: string;
} | null;

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;
const HTTP_FAILED_DEPENDENCY = 424;
const HTTP_REQUEST_TIMEOUT = 408;
const HTTP_TOO_MANY_REQUESTS = 429;

const getHttpErrorStatus = (error: unknown): unknown =>
  (error as { status?: unknown })?.status;

const getErrorBody = (error: unknown): JobStatusResponse =>
  (error as { data?: JobStatusResponse })?.data ?? null;

/**
 * Maps a `GET .../:id/status` poll to a job state.
 * The body always carries `{ status }`: 200 done, 102 in progress, 424 failed,
 * 404 unknown job. Older API versions only answer 200/102 (or an empty body),
 * so anything unexpected keeps polling.
 */
export const getJobStatus = (
  data: JobStatusResponse | undefined,
  error?: unknown,
): JobStatus => {
  if (error) {
    const httpStatus = getHttpErrorStatus(error);
    const bodyStatus = getErrorBody(error)?.status;

    if (httpStatus === HTTP_NOT_FOUND || bodyStatus === HTTP_NOT_FOUND) {
      return JOB_STATUS.NOT_FOUND;
    }

    const isTransientError =
      typeof httpStatus !== 'number' ||
      httpStatus >= 500 ||
      httpStatus === HTTP_REQUEST_TIMEOUT ||
      httpStatus === HTTP_TOO_MANY_REQUESTS;

    return isTransientError ? JOB_STATUS.PROCESSING : JOB_STATUS.FAILED;
  }

  switch (data?.status) {
    case HTTP_OK:
      return JOB_STATUS.COMPLETED;
    case HTTP_FAILED_DEPENDENCY:
      return JOB_STATUS.FAILED;
    case HTTP_NOT_FOUND:
      return JOB_STATUS.NOT_FOUND;
    default:
      return JOB_STATUS.PROCESSING;
  }
};

/**
 * `GET .../:id/result` answers `{ status: 200, result }` on success and
 * `{ status: 424, message }` / `{ status: 404 }` otherwise.
 */
export const isJobResultSuccessful = (response: JobStatusResponse) =>
  Boolean(response) &&
  (response.status === undefined || response.status === HTTP_OK);

export const getJobErrorMessage = (
  status: JobStatus,
  data?: JobStatusResponse,
  error?: unknown,
): string => {
  const response = error ? getErrorBody(error) : data;
  const message = response?.message || response?.reason;

  if (status === JOB_STATUS.NOT_FOUND) {
    return 'We could not find this job, please try again!';
  }

  return message || 'Something went wrong, please try again!';
};

export const JOB_SLOW_NOTICE_MESSAGE =
  'Processing is taking longer than usual. Please keep the plugin open, the result will appear as soon as it is ready.';
