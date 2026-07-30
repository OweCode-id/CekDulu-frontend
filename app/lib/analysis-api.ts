export type AnalysisStatus =
  | "queued"
  | "collecting"
  | "analyzing"
  | "completed"
  | "failed";

export type AnalysisSignal = {
  code: string;
  title: string;
  impact: number;
  severity: "high" | "medium" | "protective" | string;
  explanation: string;
  evidenceRefs: string[];
};

export type AnalysisResult = {
  schemaVersion: string;
  scoreMethod: string;
  riskScore: number;
  trustScore: number;
  verdict: "low_risk" | "caution" | "high_risk" | string;
  confidence: {
    score: number;
    level: "low" | "medium" | "high" | string;
    collectorCap: string;
  };
  signals: AnalysisSignal[];
  limitations: string[];
  explanation: {
    summary: string;
    reasons: string[];
    followUpQuestions: string[];
  };
  explanationSource: string;
  model: string | null;
};

export type AnalysisResponse = {
  id: string;
  status: AnalysisStatus;
  sourceUrl: string;
  canonicalUrl: string | null;
  riskScore: number | null;
  verdict: string | null;
  summary: string | null;
  result: AnalysisResult | null;
  error: { code: string; message: string } | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  statusUrl?: string;
};

export class AnalysisApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AnalysisApiError";
    this.status = status;
  }
}

function errorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Layanan analisis tidak dapat dihubungi.";
  }

  const body = payload as Record<string, unknown>;
  if (typeof body.detail === "string") return body.detail;
  if (typeof body.message === "string") return body.message;

  const urlErrors = body.url;
  if (Array.isArray(urlErrors) && typeof urlErrors[0] === "string") {
    return urlErrors[0];
  }

  const nestedError = body.error;
  if (nestedError && typeof nestedError === "object") {
    const message = (nestedError as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }

  return "Permintaan analisis tidak dapat diproses.";
}

async function requestAnalysis(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<AnalysisResponse> {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AnalysisApiError(errorMessage(payload), response.status);
  }

  return payload as AnalysisResponse;
}

export function createAnalysis(url: string): Promise<AnalysisResponse> {
  return requestAnalysis("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function getAnalysis(id: string): Promise<AnalysisResponse> {
  return requestAnalysis(`/api/analyses/${encodeURIComponent(id)}`);
}

function titleFromSlug(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function describeTokopediaUrl(sourceUrl: string): {
  productName: string;
  storeName: string;
  displayUrl: string;
} {
  try {
    const parsed = new URL(sourceUrl);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return {
      storeName: segments[0] ? titleFromSlug(segments[0]) : "Toko Tokopedia",
      productName: segments[1] ? titleFromSlug(segments[1]) : "Produk Tokopedia",
      displayUrl: `${parsed.host}${parsed.pathname}`,
    };
  } catch {
    return {
      storeName: "Toko Tokopedia",
      productName: "Produk Tokopedia",
      displayUrl: sourceUrl,
    };
  }
}

export function verdictCopy(verdict: string): {
  label: string;
  description: string;
} {
  if (verdict === "high_risk") {
    return {
      label: "Risiko Tinggi",
      description: "Ada sinyal risiko kuat yang perlu diverifikasi sebelum membeli.",
    };
  }
  if (verdict === "low_risk") {
    return {
      label: "Risiko Relatif Rendah",
      description: "Sinyal risiko kuat tidak ditemukan pada data yang berhasil diperiksa.",
    };
  }
  return {
    label: "Perlu Berhati-hati",
    description: "Ada beberapa hal yang perlu dikonfirmasi sebelum melakukan pembayaran.",
  };
}

export function confidenceLabel(level: string): string {
  if (level === "high") return "Tinggi";
  if (level === "medium") return "Sedang";
  return "Rendah";
}
