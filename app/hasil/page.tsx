"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductVisual, RiskScale, SiteFooter, SiteHeader } from "../components/SiteChrome";
import {
  AnalysisResponse,
  AnalysisSignal,
  confidenceLabel,
  describeTokopediaUrl,
  getAnalysis,
  verdictCopy,
} from "../lib/analysis-api";

type Tab = "Ringkasan" | "Harga" | "Review" | "Toko" | "Listing";

const tabs: Tab[] = ["Ringkasan", "Harga", "Review", "Toko", "Listing"];

function signalCategory(signal: AnalysisSignal): Exclude<Tab, "Ringkasan"> {
  const code = signal.code.toUpperCase();
  if (code.includes("PRICE") || code.includes("HARGA")) return "Harga";
  if (code.includes("STORE") || code.includes("TOKO") || code.includes("OFFICIAL")) return "Toko";
  if (
    code.includes("REVIEW") ||
    code.includes("ITEM") ||
    code.includes("COUNTERFEIT") ||
    code.includes("DAMAGED") ||
    code.includes("WRONG")
  ) {
    return "Review";
  }
  return "Listing";
}

function impactLabel(impact: number): string {
  if (impact > 0) return `+${impact} risiko`;
  if (impact < 0) return `−${Math.abs(impact)} risiko`;
  return "0 risiko";
}

function formatCheckedAt(value: string | null): { date: string; time: string } {
  if (!value) return { date: "Waktu tidak tersedia", time: "Data dapat berubah" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "Waktu tidak tersedia", time: "Data dapat berubah" };
  return {
    date: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date),
    time: `${new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date)} WIB · data dapat berubah`,
  };
}

function ResultState({ title, message }: { title: string; message: string }) {
  return (
    <>
      <SiteHeader />
      <main className="result-main result-state shell">
        <span className="inspection-label">LAPORAN CEKDULU</span>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="button button-primary" href="/">Kembali ke beranda</Link>
      </main>
      <SiteFooter />
    </>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("id");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Ringkasan");

  useEffect(() => {
    if (!analysisId) return;
    let active = true;

    void getAnalysis(analysisId)
      .then((latest) => {
        if (!active) return;
        if (["queued", "collecting", "analyzing"].includes(latest.status)) {
          const query = new URLSearchParams({ id: latest.id, url: latest.sourceUrl });
          window.location.replace(`/analisis?${query.toString()}`);
          return;
        }
        setAnalysis(latest);
        if (latest.status === "failed") {
          setError(latest.error?.message ?? "Analisis tidak dapat diselesaikan.");
        }
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Laporan tidak dapat dimuat.");
      });

    return () => {
      active = false;
    };
  }, [analysisId]);

  if (!analysisId) {
    return (
      <ResultState
        title="Belum ada laporan yang dipilih."
        message="Mulai pemeriksaan dari tautan produk Tokopedia untuk membuat laporan baru."
      />
    );
  }

  if (error) {
    return <ResultState title="Laporan belum dapat ditampilkan." message={error} />;
  }

  if (!analysis) {
    return (
      <ResultState
        title="Sedang memuat laporan."
        message="CekDulu sedang mengambil hasil pemeriksaan terbaru."
      />
    );
  }

  if (!analysis.result) {
    return (
      <ResultState
        title="Hasil analisis belum tersedia."
        message="Backend menyelesaikan pekerjaan tanpa data laporan yang dapat ditampilkan."
      />
    );
  }

  const result = analysis.result;
  const product = describeTokopediaUrl(analysis.canonicalUrl ?? analysis.sourceUrl);
  const verdict = verdictCopy(result.verdict);
  const checkedAt = formatCheckedAt(analysis.completedAt ?? analysis.updatedAt);
  const signals = Array.isArray(result.signals) ? result.signals : [];
  const visibleSignals = activeTab === "Ringkasan"
    ? signals
    : signals.filter((signal) => signalCategory(signal) === activeTab);
  const reasons = result.explanation?.reasons ?? [];
  const followUps = result.explanation?.followUpQuestions ?? [];
  const limitations = result.limitations ?? [];
  const sourceUrl = analysis.canonicalUrl ?? analysis.sourceUrl;
  const caseId = analysis.id.slice(0, 8).toUpperCase();

  return (
    <>
      <SiteHeader />
      <main className="result-main">
        <section className="report-hero shell">
          <div className="report-kicker-row">
            <span className="inspection-label">LAPORAN RISIKO / #{caseId}</span>
            <span className="verification-stamp"><b>✓</b> ANALISIS SELESAI</span>
          </div>

          <div className="report-summary-grid">
            <div className="product-summary">
              <ProductVisual compact />
              <div>
                <span className="source-badge">TOKOPEDIA · DATA PUBLIK</span>
                <h1>{product.productName}</h1>
                <p>{product.storeName}</p>
                <strong>Listing telah diperiksa</strong>
              </div>
            </div>

            <div className="verdict-summary">
              <span className="micro-label">INDIKASI RISIKO</span>
              <h2>{verdict.label}</h2>
              <p>{result.explanation?.summary || analysis.summary || verdict.description}</p>
            </div>

            <div className="score-summary">
              <div className="score-title">
                <strong>{result.riskScore}</strong>
                <span>/100<br />SKOR RISIKO</span>
              </div>
              <RiskScale score={result.riskScore} compact />
            </div>
          </div>

          <div className="report-metrics">
            <div>
              <span className="metric-label">TINGKAT KEYAKINAN</span>
              <strong>{result.confidence.score}%</strong>
              <div className="confidence-track">
                <span style={{ width: `${result.confidence.score}%` }} />
              </div>
              <small>{confidenceLabel(result.confidence.level)} · dipisahkan dari skor risiko</small>
            </div>
            <div>
              <span className="metric-label">TRUST SCORE</span>
              <strong>{result.trustScore}<small> / 100</small></strong>
              <p>{signals.length} sinyal terukur</p>
            </div>
            <div>
              <span className="metric-label">TERAKHIR DIPERIKSA</span>
              <strong className="date-value">{checkedAt.date}</strong>
              <p>{checkedAt.time}</p>
            </div>
            <div className="report-actions">
              <Link className="button button-outline" href={`/analisis?url=${encodeURIComponent(analysis.sourceUrl)}`}>
                Analisis Ulang
              </Link>
              <a className="button button-ink" href={sourceUrl} target="_blank" rel="noreferrer">
                Buka Listing <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <div className="report-nav-wrap">
          <nav className="report-tabs shell" aria-label="Bagian laporan">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={activeTab === tab ? "active" : ""}
                aria-pressed={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <section className="evidence-section shell" id="temuan">
          <div className="evidence-heading">
            <div>
              <span className="inspection-label">{`TEMUAN / ${activeTab.toUpperCase()}`}</span>
              <h2>
                {activeTab === "Ringkasan"
                  ? "Sinyal yang memengaruhi skor"
                  : `Temuan terkait ${activeTab.toLowerCase()}`}
              </h2>
            </div>
            <div className="legend">
              <span><i className="legend-dot risk" /> Sinyal risiko</span>
              <span><i className="legend-dot counter" /> Kontra-sinyal</span>
            </div>
          </div>

          {visibleSignals.length > 0 ? (
            <div className="evidence-grid">
              {visibleSignals.map((signal) => (
                <article className={`evidence-card ${signal.impact > 0 ? "risk" : "counter"}`} key={signal.code}>
                  <div className="evidence-card-top">
                    <span className="evidence-id">BUKTI {signal.code}</span>
                    <span className="contribution">{impactLabel(signal.impact)}</span>
                  </div>
                  <h3>{signal.title}</h3>
                  <p>{signal.explanation}</p>
                  <dl className="evidence-meta">
                    <div><dt>Bobot</dt><dd>{signal.severity}</dd></div>
                    <div>
                      <dt>Referensi</dt>
                      <dd title={signal.evidenceRefs.join(", ")}>
                        {signal.evidenceRefs.length > 0 ? `${signal.evidenceRefs.length} sumber data` : "Aturan skor"}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-evidence">
              <strong>Belum ada sinyal pada kategori ini.</strong>
              <p>Ini tidak berarti transaksi pasti aman; data pada kategori tersebut mungkin terbatas.</p>
            </div>
          )}

          {reasons.length > 0 && (
            <div className="reason-panel">
              <span className="inspection-label">ALASAN UTAMA</span>
              <ul>
                {reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </div>
          )}
        </section>

        <section className="checklist-section">
          <div className="shell checklist-grid">
            <div className="checklist-intro">
              <span className="inspection-label">TINDAKAN PRAKTIS / {String(followUps.length).padStart(2, "0")} LANGKAH</span>
              <h2>Sebelum membeli</h2>
              <p>Laporan ini bukan akhir pemeriksaan. Gunakan pertanyaan berikut untuk meminta kepastian tambahan.</p>
              <div className="agent-signoff">
                <span className="agent-signoff-mascot">
                  <Image
                    src="/agent-mascot-v2.webp"
                    alt="Maskot Agent CekDulu"
                    width="52"
                    height="52"
                  />
                </span>
                <div>
                  <b>Disusun oleh Agent CD-01</b>
                  <span>{result.scoreMethod} · Confidence {confidenceLabel(result.confidence.level).toLowerCase()}</span>
                </div>
              </div>
            </div>
            <ol className="action-checklist">
              {(followUps.length > 0 ? followUps : [
                "Apakah detail produk dan kebijakan pengembalian sudah dikonfirmasi?",
              ]).map((question, index) => (
                <li key={question}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{question}</h3>
                    <p>Konfirmasi melalui fitur resmi Tokopedia dan simpan bukti percakapan.</p>
                  </div>
                  <b>{index === 0 ? "PRIORITAS" : "PERIKSA"}</b>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {limitations.length > 0 && (
          <section className="limitations-panel shell">
            <span className="inspection-label">KETERBATASAN PEMERIKSAAN</span>
            <ul>
              {limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>
        )}

        <section className="disclaimer shell">
          <span>ⓘ</span>
          <p><b>Tentang hasil ini:</b> CekDulu menampilkan indikasi berdasarkan data publik yang tersedia saat pemeriksaan. Hasil bukan jaminan transaksi bebas masalah dan dapat berubah ketika listing atau reputasi toko berubah.</p>
          <span className="mono">CD/MVP-1</span>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultState title="Sedang memuat laporan." message="CekDulu sedang menyiapkan data hasil pemeriksaan." />}>
      <ResultContent />
    </Suspense>
  );
}
