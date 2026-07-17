"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="CekDulu, kembali ke beranda">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-check">✓</span>
          </span>
          <span>CekDulu</span>
        </Link>

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
          <Link href="/#cara-kerja" onClick={() => setOpen(false)}>Cara Kerja</Link>
          <Link href="/#metodologi" onClick={() => setOpen(false)}>Metodologi</Link>
          <Link href="/#tentang" onClick={() => setOpen(false)}>Tentang</Link>
          <Link className="button button-small button-ink" href="/#cek-produk" onClick={() => setOpen(false)}>
            Coba Sekarang <span aria-hidden="true">↗</span>
          </Link>
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
          <Link className="brand brand-footer" href="/">
            <span className="brand-mark" aria-hidden="true"><span className="brand-check">✓</span></span>
            <span>CekDulu</span>
          </Link>
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

type ProductVisualProps = {
  compact?: boolean;
  imageUrl?: string | null;
  productName?: string;
};

export function ProductVisual({
  compact = false,
  imageUrl = null,
  productName = "produk Tokopedia",
}: ProductVisualProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showProductImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;
  const className = ["product-visual", compact ? "compact" : "", showProductImage ? "has-image" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      aria-label={showProductImage ? `Foto ${productName} dari Tokopedia` : "Visual placeholder produk Tokopedia"}
    >
      {showProductImage && imageUrl ? (
        <Image
          className="product-image"
          src={imageUrl}
          alt={`Foto ${productName} dari listing Tokopedia`}
          fill
          sizes={compact ? "120px" : "(max-width: 720px) 90vw, 420px"}
          unoptimized
          onError={() => setFailedImageUrl(imageUrl)}
        />
      ) : (
        <div className="phone-back">
          <div className="camera-block">
            <span /><span /><span />
          </div>
          <div className="phone-mark">●</div>
        </div>
      )}
      <span className="product-tag">PRODUK</span>
    </div>
  );
}

export function RiskScale({ score = 0, compact = false }: { score?: number; compact?: boolean }) {
  const safeScore = Math.max(0, Math.min(100, score));
  return (
    <div className={compact ? "risk-scale compact" : "risk-scale"}>
      <div className="risk-track" aria-label={`Skor indikasi risiko ${safeScore} dari 100`}>
        <span className="risk-zone low" />
        <span className="risk-zone medium" />
        <span className="risk-zone high" />
        <span className="risk-marker" style={{ left: `${safeScore}%` }}>
          <span>{safeScore}</span>
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
