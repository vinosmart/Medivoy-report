export type ReportMetricData = {
  createdAt?: Date | number | string | null;
  findings?: unknown;
  overallHealthScore?: unknown;
  riskScore?: unknown;
  status?: unknown;
  title?: unknown;
};

const isAnalyzed = (report: ReportMetricData) =>
  ["done", "completed"].includes(String(report.status || "").toLowerCase());

const timestamp = (value: ReportMetricData["createdAt"]) => {
  const parsed =
    value instanceof Date
      ? value.getTime()
      : typeof value === "number" || typeof value === "string"
        ? new Date(value).getTime()
        : 0;
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getLatestAnalyzedReport = <T extends ReportMetricData>(
  reports: T[],
): T | null =>
  reports
    .filter(isAnalyzed)
    .sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))[0] ?? null;

export const readHealthScore = (value: unknown): number | null => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;

  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= 100
    ? Math.round(score)
    : null;
};

export const countFlaggedFindings = (
  report: ReportMetricData | null,
): number | null => {
  if (!report || !Array.isArray(report.findings)) return null;

  return report.findings.filter((finding) => {
    if (!finding || typeof finding !== "object" || !("status" in finding)) {
      return false;
    }

    const status = String(finding.status || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");
    return status !== "" && status !== "normal";
  }).length;
};
