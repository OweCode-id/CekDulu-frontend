"use client";

import { useState } from "react";
import { ProductVisual, RiskScale, SiteFooter, SiteHeader } from "../components/SiteChrome";

type Tab = "Ringkasan" | "Harga" | "Review" | "Toko" | "Listing";
type Evidence = {
  id: string;
  category: Exclude<Tab, "Ringkasan">;
  type: "risk" | "counter";
  title: string;
  contribution: string;
  finding: string;
  confidence: string;
  sample: string;
};

const tabs: Tab[] = ["Ringkasan", "Harga", "Review", "Toko", "Listing"];

const evidence: Evidence[] = [
  {
    id: "P-01", category: "Harga", type: "risk", title: "Harga 39% di bawah median pembanding", contribution: "+18 risiko",
    finding: "Harga listing Rp4,2 juta, sedangkan median delapan produk dengan model dan kapasitas sebanding adalah Rp6,89 juta.",
    confidence: "Tinggi", sample: "8 listing pembanding",
  },
  {
    id: "R-03", category: "Review", type: "risk", title: "Keluhan IMEI muncul berulang", contribution: "+15 risiko",
    finding: "Enam review menyebut IMEI tidak terdaftar, tidak cocok, atau perlu diperiksa kembali setelah barang diterima.",
    confidence: "Sedang", sample: "6 dari 40 review",
  },
  {
    id: "R-07", category: "Review", type: "risk", title: "Ajakan berpindah ke WhatsApp", contribution: "+13 risiko",
    finding: "Dua pembeli menyebut penjual meminta komunikasi lanjutan melalui WhatsApp sebelum transaksi selesai.",
    confidence: "Sedang", sample: "2 dari 40 review",
  },
  {
    id: "L-02", category: "Listing", type: "risk", title: "Informasi garansi belum konsisten", contribution: "+8 risiko",
    finding: "Judul menyebut garansi resmi, tetapi bagian deskripsi mencantumkan garansi distributor selama 12 bulan.",
    confidence: "Tinggi", sample: "2 bagian listing",
  },
  {
    id: "T-02", category: "Toko", type: "counter", title: "Toko telah beroperasi selama empat tahun", contribution: "−6 risiko",
    finding: "Profil publik toko menunjukkan aktivitas penjualan yang konsisten sejak Juli 2022.",
    confidence: "Tinggi", sample: "1 profil toko",
  },
  {
    id: "T-05", category: "Toko", type: "counter", title: "Lebih dari 12.000 transaksi selesai", contribution: "−5 risiko",
    finding: "Indikator publik menunjukkan 12.487 transaksi telah selesai, dengan rating toko 4,8 dari 5.",
    confidence: "Tinggi", sample: "12.487 transaksi",
  },
  {
    id: "L-06", category: "Listing", type: "counter", title: "Foto produk konsisten secara internal", contribution: "−4 risiko",
    finding: "Warna, susunan kamera, kapasitas, dan label model konsisten pada sembilan foto listing yang diperiksa.",
    confidence: "Sedang", sample: "9 foto listing",
  },
];

export default function ResultPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Ringkasan");
  const visibleEvidence = activeTab === "Ringkasan" ? evidence : evidence.filter((item) => item.category === activeTab);

  return (
    <>
      <SiteHeader />
      <main className="result-main">
        <section className="report-hero shell">
          <div className="report-kicker-row">
            <span className="inspection-label">LAPORAN RISIKO / #CD-0716-042</span>
            <span className="verification-stamp"><b>✓</b> BUKTI TERNORMALISASI</span>
          </div>

          <div className="report-summary-grid">
            <div className="product-summary">
              <ProductVisual compact />
              <div>
                <span className="source-badge">TOKOPEDIA · LISTING AKTIF</span>
                <h1>iPhone 14 Pro 256 GB</h1>
                <p>Gudang Gawai Nusantara <span>·</span> Jakarta Utara</p>
                <strong>Rp4.200.000</strong>
              </div>
            </div>

            <div className="verdict-summary">
              <span className="micro-label">INDIKASI RISIKO</span>
              <h2>Perlu Berhati-hati</h2>
              <p>Ada beberapa sinyal yang perlu dikonfirmasi sebelum melakukan pembayaran.</p>
            </div>

            <div className="score-summary">
              <div className="score-title"><strong>72</strong><span>/100<br />SKOR RISIKO</span></div>
              <RiskScale score={72} compact />
            </div>
          </div>

          <div className="report-metrics">
            <div>
              <span className="metric-label">TINGKAT KEYAKINAN</span>
              <strong>68%</strong>
              <div className="confidence-track"><span style={{ width: '68%' }} /></div>
              <small>Sedang · sebagian data perlu verifikasi</small>
            </div>
            <div>
              <span className="metric-label">CAKUPAN DATA</span>
              <strong>40 <small>dari 2.314 review</small></strong>
              <p>8 harga pembanding</p>
            </div>
            <div>
              <span className="metric-label">TERAKHIR DIPERIKSA</span>
              <strong className="date-value">16 Juli 2026</strong>
              <p>15:42 WIB · data dapat berubah</p>
            </div>
            <div className="report-actions">
              <a className="button button-outline" href="/analisis">Analisis Ulang</a>
              <a className="button button-ink" href="https://www.tokopedia.com/" target="_blank" rel="noreferrer">Buka Listing <span aria-hidden="true">↗</span></a>
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
              <h2>{activeTab === "Ringkasan" ? "Bukti yang paling memengaruhi laporan" : `Temuan terkait ${activeTab.toLowerCase()}`}</h2>
            </div>
            <div className="legend">
              <span><i className="legend-dot risk" /> Sinyal risiko</span>
              <span><i className="legend-dot counter" /> Kontra-sinyal</span>
            </div>
          </div>

          <div className="evidence-grid">
            {visibleEvidence.map((item) => (
              <article className={`evidence-card ${item.type}`} key={item.id}>
                <div className="evidence-card-top">
                  <span className="evidence-id">BUKTI {item.id}</span>
                  <span className="contribution">{item.contribution}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.finding}</p>
                <dl className="evidence-meta">
                  <div><dt>Keyakinan</dt><dd>{item.confidence}</dd></div>
                  <div><dt>Sampel</dt><dd>{item.sample}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="checklist-section">
          <div className="shell checklist-grid">
            <div className="checklist-intro">
              <span className="inspection-label">TINDAKAN PRAKTIS / 03 LANGKAH</span>
              <h2>Sebelum membeli</h2>
              <p>Laporan ini bukan akhir pemeriksaan. Gunakan temuan di atas untuk meminta bukti tambahan dari penjual.</p>
              <div className="agent-signoff">
                <span className="agent-signoff-mascot">
                  <img
                    src="/agent-mascot-v2.webp"
                    alt="Maskot Agent CekDulu"
                    width="52"
                    height="52"
                    loading="lazy"
                  />
                </span>
                <div><b>Disusun oleh Agent CD-01</b><span>Scoring protocol mvp-1 · Confidence sedang</span></div>
              </div>
            </div>
            <ol className="action-checklist">
              <li><span>01</span><div><h3>Minta foto IMEI yang aktual</h3><p>Cocokkan nomor pada perangkat, dus, dan situs pemeriksaan resmi sebelum masa komplain berakhir.</p></div><b>PRIORITAS</b></li>
              <li><span>02</span><div><h3>Konfirmasi jenis garansi</h3><p>Minta penjual menjelaskan perbedaan antara klaim garansi resmi dan garansi distributor di deskripsi.</p></div><b>PENTING</b></li>
              <li><span>03</span><div><h3>Tetap bayar di Tokopedia</h3><p>Jangan memindahkan komunikasi atau pembayaran ke WhatsApp, transfer langsung, atau kanal pribadi lain.</p></div><b>WAJIB</b></li>
            </ol>
          </div>
        </section>

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
