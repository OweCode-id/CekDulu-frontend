"use client";

import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="/" aria-label="CekDulu, kembali ke beranda">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-check">✓</span>
          </span>
          <span>CekDulu</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Navigasi utama">
          <a href="/#cara-kerja" onClick={() => setOpen(false)}>Cara Kerja</a>
          <a href="/#metodologi" onClick={() => setOpen(false)}>Metodologi</a>
          <a href="/#tentang" onClick={() => setOpen(false)}>Tentang</a>
          <a className="button button-small button-ink" href="/analisis" onClick={() => setOpen(false)}>
            Coba Sekarang <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <a className="brand brand-footer" href="/">
            <span className="brand-mark" aria-hidden="true"><span className="brand-check">✓</span></span>
            <span>CekDulu</span>
          </a>
          <p>Asisten investigasi belanja berbasis bukti untuk keputusan yang lebih tenang.</p>
        </div>
        <div className="footer-note">
          <span className="inspection-label">CATATAN PENTING</span>
          <p>CekDulu menampilkan indikasi risiko, bukan vonis penipuan atau jaminan keamanan transaksi.</p>
        </div>
        <div className="footer-meta">
          <span>PROTOKOL CD/MVP-01</span>
          <span>© 2026 CekDulu</span>
        </div>
      </div>
    </footer>
  );
}

export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "product-visual compact" : "product-visual"} aria-label="Ilustrasi iPhone 14 Pro berwarna ungu gelap">
      <div className="phone-back">
        <div className="camera-block">
          <span /><span /><span />
        </div>
        <div className="phone-mark">●</div>
      </div>
      <span className="product-tag">256 GB</span>
    </div>
  );
}

export function RiskScale({ score = 72, compact = false }: { score?: number; compact?: boolean }) {
  return (
    <div className={compact ? "risk-scale compact" : "risk-scale"}>
      <div className="risk-track" aria-label={`Skor indikasi risiko ${score} dari 100`}>
        <span className="risk-zone low" />
        <span className="risk-zone medium" />
        <span className="risk-zone high" />
        <span className="risk-marker" style={{ left: `${score}%` }}>
          <span>{score}</span>
        </span>
      </div>
      <div className="risk-labels" aria-hidden="true">
        <span>Rendah</span>
        <span>Sedang</span>
        <span>Tinggi</span>
      </div>
    </div>
  );
}

