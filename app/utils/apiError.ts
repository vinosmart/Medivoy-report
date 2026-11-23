type ApiErrorDetails = {
  data?: { message?: unknown; statusCode?: unknown };
  message?: unknown;
  status?: unknown;
  statusCode?: unknown;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!error || typeof error !== "object") return fallback;

  const details = error as ApiErrorDetails;
  const status = Number(
    details.statusCode ?? details.status ?? details.data?.statusCode,
  );

  if (status === 401) return "Please sign in to access this feature.";
  if (status === 403) return "Your account does not have access to this feature.";

  if (typeof details.data?.message === "string") {
    return details.data.message;
  }

  if (
    typeof details.message === "string" &&
    !/fetch failed|network error/i.test(details.message)
  ) {
    return details.message;
  }

  return fallback;
};
