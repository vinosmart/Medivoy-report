let inFlightReportsRequest: {
  key: string;
  promise: Promise<any[]>;
} | null = null;

export const getDeduplicatedReports = (
  key: string,
  request: () => Promise<any[]>,
): Promise<any[]> => {
  if (!import.meta.client) return request();

  if (inFlightReportsRequest?.key !== key) {
    inFlightReportsRequest = { key, promise: request() };
  }

  const activeRequest = inFlightReportsRequest;
  return activeRequest.promise.finally(() => {
    if (inFlightReportsRequest === activeRequest) {
      inFlightReportsRequest = null;
    }
  });
};
