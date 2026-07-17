"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductVisual, SiteHeader } from "../components/SiteChrome";

const defaultSourceUrl = "https://www.tokopedia.com/gudanggawai/iphone-14-pro-256-gb";

const stages = [
  { title: "Membuka halaman produk", detail: "Halaman produk dapat diakses dalam sesi anonim", code: "URL-01" },
  { title: "Mengumpulkan informasi listing", detail: "Nama, harga, variasi, badge, dan deskripsi tercatat", code: "LST-02" },
  { title: "Memeriksa kredibilitas toko", detail: "4 tahun operasi dan 12.487 transaksi ditemukan", code: "TOK-03" },
  { title: "Menganalisis sampel review", detail: "40 dari 2.314 review berhasil diperiksa", code: "REV-04" },
  { title: "Membandingkan harga", detail: "8 produk pembanding ditemukan", code: "PRC-05" },
  { title: "Menyusun laporan", detail: "Bukti diberi bobot dan keterbatasan dicatat", code: "RPT-06" },
];

function AnalysisContent() {
  const searchParams = useSearchParams();
  const [activeStage, setActiveStage] = useState(0);
  const [finished, setFinished] = useState(false);
  const url = searchParams.get("url") || defaultSourceUrl;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStage((current) => {
        if (current >= stages.length - 1) {
          window.clearInterval(timer);
          window.setTimeout(() => setFinished(true), 900);
          return current;
        }
        return current + 1;
      });
    }, 1300);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="analysis-page">
      <SiteHeader />
      <main className="analysis-main shell">
        <div className="analysis-heading">
          <div>
            <span className="inspection-label">INVESTIGASI AKTIF / #CD-0716-042</span>
            <h1>{finished ? "Laporan siap diperiksa." : "Sedang mengumpulkan bukti."}</h1>
          </div>
          <div className={finished ? "live-status complete" : "live-status"}>
            <span /> {finished ? "ANALISIS SELESAI" : "AGENT CD-01 BEKERJA"}
          </div>
        </div>

        <div className="analysis-layout">
          <aside className="product-case-card">
            <div className="case-scan-window">
              <ProductVisual />
              {!finished && <span className="scan-line" />}
              <span className="case-corner top-left" /><span className="case-corner top-right" />
              <span className="case-corner bottom-left" /><span className="case-corner bottom-right" />
            </div>
            <div className="case-content">
              <span className="source-badge">TOKOPEDIA · DATA PUBLIK</span>
              <h2>iPhone 14 Pro 256 GB</h2>
              <p className="case-seller">Gudang Gawai Nusantara</p>
              <strong className="case-price">Rp4.200.000</strong>
              <div className="case-divider" />
              <dl className="case-facts">
                <div><dt>Status listing</dt><dd>Aktif</dd></div>
                <div><dt>Rating terlihat</dt><dd>4,7 · 2.314 ulasan</dd></div>
                <div><dt>Sumber</dt><dd className="mono truncate" title={url}>{url.replace('https://', '')}</dd></div>
              </dl>
            </div>
            <div className="agent-card-mini">
              <div className="agent-avatar small">CD</div>
              <div><span>AGENT INVESTIGASI</span><strong>CD-01 · Sesi anonim</strong></div>
              <span className="agent-status-dot" />
            </div>
          </aside>

          <section className="timeline-panel" aria-live="polite">
            <div className="timeline-top">
              <div>
                <span className="micro-label">LOG PEMERIKSAAN LANGSUNG</span>
                <p>Progres mengikuti tahapan yang benar-benar telah dilalui.</p>
              </div>
              <span className="timecode">15:42:{String(18 + activeStage * 7).padStart(2, '0')}</span>
            </div>

            <ol className="investigation-timeline">
              {stages.map((stage, index) => {
                const state = finished || index < activeStage ? "done" : index === activeStage ? "active" : "pending";
                return (
                  <li className={state} key={stage.code}>
                    <div className="timeline-node"><span>{state === "done" ? "✓" : index + 1}</span></div>
                    <div className="timeline-copy">
                      <div><h3>{stage.title}</h3><span className="timeline-code">{stage.code}</span></div>
                      <p>{state === "pending" ? "Menunggu tahap sebelumnya" : stage.detail}</p>
                      {state === "active" && !finished && <div className="activity-line"><span /></div>}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className={finished ? "analysis-callout finished" : "analysis-callout"}>
              <span className="callout-icon">{finished ? "✓" : "⌁"}</span>
              <div>
                <strong>{finished ? "53 bukti telah disusun" : stages[activeStage].detail}</strong>
                <p>{finished ? "Skor, confidence, kontra-sinyal, dan langkah pemeriksaan tersedia." : "Agent tidak akan menebak data yang gagal dikumpulkan."}</p>
              </div>
              {finished ? (
                <Link className="button button-primary" href="/hasil">Baca laporan <span aria-hidden="true">→</span></Link>
              ) : <span className="working-dots" aria-hidden="true"><i /><i /><i /></span>}
            </div>
            {!finished && <Link className="skip-link" href="/hasil">Lewati ke laporan demo</Link>}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="analysis-page"><SiteHeader /></div>}>
      <AnalysisContent />
    </Suspense>
  );
}
