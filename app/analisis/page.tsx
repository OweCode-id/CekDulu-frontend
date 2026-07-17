"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ProductVisual, SiteHeader } from "../components/SiteChrome";
import {
  AnalysisResponse,
  createAnalysis,
  describeTokopediaUrl,
  getAnalysis,
} from "../lib/analysis-api";

const stages = [
  {
    title: "Masuk ke antrean pemeriksaan",
    detail: "Permintaan diterima dan menunggu worker yang tersedia.",
    code: "QUE-01",
  },
  {
    title: "Mengumpulkan bukti publik",
    detail: "Halaman produk dan toko diperiksa melalui browser terisolasi.",
    code: "COL-02",
  },
  {
    title: "Menganalisis sinyal risiko",
    detail: "Bukti dinormalisasi, diberi bobot, dan dirangkum.",
    code: "RSK-03",
  },
  {
    title: "Menyusun laporan",
    detail: "Skor, alasan, confidence, dan keterbatasan telah tersedia.",
    code: "RPT-04",
  },
];

function stageIndex(status: AnalysisResponse["status"] | undefined): number {
  if (status === "collecting") return 1;
  if (status === "analyzing") return 2;
  if (status === "completed") return 3;
  return 0;
}

function statusLabel(status: AnalysisResponse["status"] | undefined): string {
  if (status === "collecting") return "MENGUMPULKAN BUKTI";
  if (status === "analyzing") return "MENILAI SINYAL RISIKO";
  if (status === "completed") return "ANALISIS SELESAI";
  if (status === "failed") return "ANALISIS TERHENTI";
  return "MENUNGGU WORKER";
}

function LoadingShell() {
  return (
    <div className="analysis-page">
      <SiteHeader />
      <main className="analysis-main shell result-state">
        <span className="inspection-label">MENYIAPKAN SESI</span>
        <h1>Menghubungkan ke layanan analisis.</h1>
        <p>Mohon tunggu sebentar.</p>
      </main>
    </div>
  );
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const requestedUrl = searchParams.get("url");
  const resumeId = searchParams.get("id");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if ((!requestedUrl && !resumeId) || startedRef.current) return;

    startedRef.current = true;
    let active = true;
    let pollTimer: number | undefined;
    let redirectTimer: number | undefined;

    async function poll(id: string): Promise<void> {
      const latest = await getAnalysis(id);
      if (!active) return;

      setAnalysis(latest);
      if (latest.status === "completed") {
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          redirectTimer = window.setTimeout(() => {
            window.location.assign(`/hasil?id=${encodeURIComponent(latest.id)}`);
          }, 700);
        }
        return;
      }

      if (latest.status === "failed") {
        setError(latest.error?.message ?? "Analisis tidak dapat diselesaikan.");
        return;
      }

      pollTimer = window.setTimeout(() => {
        void poll(id).catch(handleFailure);
      }, 2500);
    }

    function handleFailure(reason: unknown): void {
      if (!active) return;
      setError(
        reason instanceof Error
          ? reason.message
          : "Terjadi gangguan saat memeriksa status analisis.",
      );
    }

    async function start(): Promise<void> {
      let id = resumeId;

      if (!id && requestedUrl) {
        const created = await createAnalysis(requestedUrl);
        if (!active) return;
        setAnalysis(created);
        id = created.id;
        const query = new URLSearchParams({ id, url: created.sourceUrl });
        window.history.replaceState(null, "", `/analisis?${query.toString()}`);
      }

      if (id) await poll(id);
    }

    void start().catch(handleFailure);

    return () => {
      active = false;
      if (pollTimer) window.clearTimeout(pollTimer);
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [requestedUrl, resumeId]);

  const sourceUrl = analysis?.sourceUrl ?? requestedUrl ?? "";
  const product = describeTokopediaUrl(sourceUrl);
  const activeStage = stageIndex(analysis?.status);
  const completed = analysis?.status === "completed";
  const failed = analysis?.status === "failed" || Boolean(error);
  const missingRequest = !requestedUrl && !resumeId;
  const failureMessage = error ?? analysis?.error?.message;
  const caseId = analysis?.id ? analysis.id.slice(0, 8).toUpperCase() : "BARU";

  function retryAnalysis(): void {
    if (sourceUrl) {
      window.location.assign(`/analisis?url=${encodeURIComponent(sourceUrl)}`);
    } else {
      window.location.assign("/");
    }
  }

  return (
    <div className="analysis-page">
      <SiteHeader />
      <main className="analysis-main shell">
        <div className="analysis-heading">
          <div>
            <span className="inspection-label">INVESTIGASI / #{caseId}</span>
            <h1>
              {failed
                ? "Pemeriksaan belum berhasil."
                : completed
                  ? "Laporan siap diperiksa."
                  : "Sedang mengumpulkan bukti."}
            </h1>
          </div>
          <div className={`live-status${completed ? " complete" : failed ? " failed" : ""}`}>
            <span /> {failed ? "PERLU DICOBA LAGI" : statusLabel(analysis?.status)}
          </div>
        </div>

        <div className="analysis-layout">
          <aside className="product-case-card">
            <div className="case-scan-window">
              <ProductVisual />
              {!completed && !failed && <span className="scan-line" />}
              <span className="case-corner top-left" />
              <span className="case-corner top-right" />
              <span className="case-corner bottom-left" />
              <span className="case-corner bottom-right" />
            </div>
            <div className="case-content">
              <span className="source-badge">TOKOPEDIA · DATA PUBLIK</span>
              <h2>{product.productName}</h2>
              <p className="case-seller">{product.storeName}</p>
              <strong className="case-price">
                {completed ? "Data berhasil dianalisis" : "Pemeriksaan berlangsung"}
              </strong>
              <div className="case-divider" />
              <dl className="case-facts">
                <div>
                  <dt>Status</dt>
                  <dd>{failed ? "Gagal" : statusLabel(analysis?.status)}</dd>
                </div>
                <div>
                  <dt>Sesi</dt>
                  <dd>Browser terisolasi</dd>
                </div>
                <div>
                  <dt>Sumber</dt>
                  <dd className="mono truncate" title={sourceUrl || undefined}>
                    {sourceUrl ? product.displayUrl : "URL belum tersedia"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="agent-card-mini">
              <div className="agent-avatar small">CD</div>
              <div>
                <span>AGENT INVESTIGASI</span>
                <strong>CD-01 · Sesi anonim</strong>
              </div>
              <span className="agent-status-dot" />
            </div>
          </aside>

          <section className="timeline-panel" aria-live="polite">
            <div className="timeline-top">
              <div>
                <span className="micro-label">LOG PEMERIKSAAN LANGSUNG</span>
                <p>Progres diperbarui dari status pekerjaan di backend.</p>
              </div>
              <span className="timecode">{analysis?.status.toUpperCase() ?? "CONNECTING"}</span>
            </div>

            <ol className="investigation-timeline">
              {stages.map((stage, index) => {
                const state = completed || index < activeStage
                  ? "done"
                  : index === activeStage
                    ? "active"
                    : "pending";
                return (
                  <li className={state} key={stage.code}>
                    <div className="timeline-node">
                      <span>{state === "done" ? "✓" : index + 1}</span>
                    </div>
                    <div className="timeline-copy">
                      <div>
                        <h3>{stage.title}</h3>
                        <span className="timeline-code">{stage.code}</span>
                      </div>
                      <p>{state === "pending" ? "Menunggu tahap sebelumnya" : stage.detail}</p>
                      {state === "active" && !failed && !completed && (
                        <div className="activity-line"><span /></div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className={`analysis-callout${completed ? " finished" : failed || missingRequest ? " failed" : ""}`}>
              <span className="callout-icon">{completed ? "✓" : failed || missingRequest ? "!" : "⌁"}</span>
              <div>
                <strong>
                  {missingRequest
                    ? "Tautan produk belum diberikan"
                    : failureMessage ?? (completed ? "Laporan telah selesai disusun" : stages[activeStage].detail)}
                </strong>
                <p>
                  {failed || missingRequest
                    ? "Tidak ada skor yang dibuat dari data yang belum berhasil dikumpulkan."
                    : completed
                      ? "Anda akan diarahkan ke laporan lengkap."
                      : "Jangan tutup halaman ini selama pemeriksaan berlangsung."}
                </p>
              </div>
              {completed && analysis ? (
                <Link className="button button-primary" href={`/hasil?id=${encodeURIComponent(analysis.id)}`}>
                  Baca laporan <span aria-hidden="true">→</span>
                </Link>
              ) : failed ? (
                <button className="button button-primary" type="button" onClick={retryAnalysis}>
                  Coba lagi <span aria-hidden="true">→</span>
                </button>
              ) : missingRequest ? (
                <Link className="button button-primary" href="/">
                  Masukkan tautan <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="working-dots" aria-hidden="true"><i /><i /><i /></span>
              )}
            </div>
            {!completed && (
              <Link className="skip-link" href="/">Kembali ke beranda</Link>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <AnalysisContent />
    </Suspense>
  );
}
