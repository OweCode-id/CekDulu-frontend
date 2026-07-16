"use client";

import { FormEvent, useState } from "react";
import { ProductVisual, RiskScale, SiteFooter, SiteHeader } from "./components/SiteChrome";

const exampleUrl = "https://www.tokopedia.com/gudanggawai/iphone-14-pro-256-gb";

export default function Home() {
  const [url, setUrl] = useState("");
  const [pasteLabel, setPasteLabel] = useState("Tempel");
  const [error, setError] = useState("");

  function startAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const looksLikeTokopedia = /^https:\/\/(www\.)?tokopedia\.com\//i.test(url.trim());
    if (!looksLikeTokopedia) {
      setError("Masukkan tautan produk Tokopedia yang valid dan menggunakan HTTPS.");
      return;
    }
    window.location.href = `/analisis?url=${encodeURIComponent(url.trim())}`;
  }

  async function pasteUrl() {
    try {
      const clipboard = await navigator.clipboard.readText();
      if (clipboard) {
        setUrl(clipboard);
        setError("");
        setPasteLabel("Ditempel");
        window.setTimeout(() => setPasteLabel("Tempel"), 1500);
      }
    } catch {
      setPasteLabel("Ctrl + V");
      window.setTimeout(() => setPasteLabel("Tempel"), 1800);
    }
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> ASISTEN BELANJA AMAN</div>
            <h1>Cek dulu sebelum <span className="headline-mark">checkout.</span></h1>
            <p className="hero-lede">
              Kami menyelidiki listing produk, pola harga, mutu review, dan rekam jejak toko—lalu merangkumnya menjadi indikasi risiko yang bisa kamu periksa sendiri.
            </p>
            <p className="neutral-note"><span aria-hidden="true">ⓘ</span> Bukan vonis penipuan. Setiap temuan disertai bukti dan tingkat keyakinan.</p>

            <form className="url-form" onSubmit={startAnalysis} noValidate>
              <label htmlFor="tokopedia-url">Tautan produk Tokopedia</label>
              <div className="url-input-wrap">
                <span className="link-symbol" aria-hidden="true">↗</span>
                <input
                  id="tokopedia-url"
                  type="url"
                  value={url}
                  onChange={(event) => { setUrl(event.target.value); setError(""); }}
                  placeholder="https://www.tokopedia.com/toko/nama-produk"
                  aria-describedby={error ? "url-error" : undefined}
                />
                <button type="button" className="paste-button" onClick={pasteUrl}>{pasteLabel}</button>
              </div>
              {error && <p className="form-error" id="url-error">{error}</p>}
              <div className="form-actions">
                <button className="button button-primary" type="submit">Periksa Produk <span aria-hidden="true">→</span></button>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => { setUrl(exampleUrl); setError(""); }}
                >
                  Gunakan contoh <span aria-hidden="true">↗</span>
                </button>
              </div>
            </form>
          </div>

          <aside className="hero-dossier" aria-label="Pratinjau berkas investigasi">
            <div className="dossier-tab">BERKAS #CD-0716</div>
            <div className="dossier-paper">
              <div className="dossier-topline">
                <span className="inspection-label">PRA-TINJAU INVESTIGASI</span>
                <span className="source-badge">TOKOPEDIA</span>
              </div>
              <div className="dossier-product">
                <ProductVisual compact />
                <div>
                  <span className="micro-label">PRODUK TERDETEKSI</span>
                  <h2>iPhone 14 Pro 256 GB</h2>
                  <p>Gudang Gawai Nusantara</p>
                </div>
              </div>
              <div className="dossier-facts">
                <div><span>Harga listing</span><strong>Rp4.200.000</strong></div>
                <div><span>Bukti diperiksa</span><strong>53 item</strong></div>
              </div>
              <div className="stamp-row">
                <span className="agent-seal">CD-01<br /><b>TERVERIFIKASI</b></span>
                <p>Data publik<br />Sesi anonim</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="process-section shell" id="cara-kerja">
          <div className="section-heading split-heading">
            <div>
              <span className="inspection-label">PROSEDUR PEMERIKSAAN / 03 TAHAP</span>
              <h2>Dari tautan menjadi temuan yang bisa ditindaklanjuti.</h2>
            </div>
            <p>Agent bekerja pada data publik dengan sesi anonim, lalu memisahkan fakta, indikasi, dan keterbatasan.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon link-icon" aria-hidden="true">↗</div>
              <h3>Tempel tautan</h3>
              <p>Masukkan URL produk Tokopedia yang ingin kamu periksa.</p>
              <span className="step-meta">± 5 DETIK</span>
            </article>
            <article className="step-card featured">
              <span className="step-number">02</span>
              <div className="step-icon scan-icon" aria-hidden="true"><span /></div>
              <h3>Agent mengumpulkan bukti</h3>
              <p>Listing, sampel review, harga pembanding, dan reputasi toko diperiksa terpisah.</p>
              <span className="step-meta">SESI ANONIM</span>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon report-icon" aria-hidden="true">✓</div>
              <h3>Pahami risikonya</h3>
              <p>Baca kontribusi risiko, bukti pendukung, kontra-sinyal, dan langkah aman.</p>
              <span className="step-meta">LAPORAN TERSTRUKTUR</span>
            </article>
          </div>
        </section>

        <section className="preview-section" id="metodologi">
          <div className="shell result-preview-grid">
            <div className="preview-intro">
              <span className="inspection-label">CONTOH LAPORAN / DATA DEMO</span>
              <h2>Satu skor saja tidak cukup.</h2>
              <p>CekDulu menunjukkan mengapa suatu listing perlu dicermati—dan bukti apa yang justru menurunkan risikonya.</p>
              <ul className="method-list">
                <li><span>01</span> Skor dihitung dari aturan yang dapat dijelaskan.</li>
                <li><span>02</span> Confidence dipisahkan dari tingkat risiko.</li>
                <li><span>03</span> Sampel dan sumber selalu dicantumkan.</li>
              </ul>
              <a className="button button-outline" href="/hasil">Buka laporan lengkap <span aria-hidden="true">→</span></a>
            </div>
            <article className="report-preview">
              <div className="report-preview-head">
                <div>
                  <span className="micro-label">HASIL PEMERIKSAAN #CD-0716-042</span>
                  <h3>Perlu Berhati-hati</h3>
                  <p>iPhone 14 Pro 256 GB · Rp4.200.000</p>
                </div>
                <div className="score-lockup"><strong>72</strong><span>/100<br />RISIKO</span></div>
              </div>
              <RiskScale score={72} />
              <div className="preview-evidence">
                <div className="evidence-row risk">
                  <span className="evidence-index">P-01</span>
                  <div><strong>Harga jauh di bawah pembanding</strong><small>39% di bawah median 8 listing sebanding</small></div>
                  <b>+18</b>
                </div>
                <div className="evidence-row risk">
                  <span className="evidence-index">R-03</span>
                  <div><strong>Keluhan IMEI muncul berulang</strong><small>Ditemukan pada 6 dari 40 review sampel</small></div>
                  <b>+15</b>
                </div>
                <div className="evidence-row positive">
                  <span className="evidence-index">T-02</span>
                  <div><strong>Rekam jejak toko cukup panjang</strong><small>Beroperasi 4 tahun · 12.487 transaksi</small></div>
                  <b>−6</b>
                </div>
              </div>
              <div className="report-preview-foot">
                <span>KEYAKINAN <b>68%</b></span>
                <span>53 BUKTI</span>
                <span>DIPERIKSA 16 JUL 2026</span>
              </div>
            </article>
          </div>
        </section>

        <section className="about-section shell" id="tentang">
          <div className="about-card">
            <div className="agent-profile">
              <span className="agent-avatar">CD</span>
              <span className="agent-status-dot" />
            </div>
            <div>
              <span className="inspection-label">AGENT INVESTIGASI / CD-01</span>
              <h2>Teliti pada bukti, netral pada kesimpulan.</h2>
              <p>Agent CekDulu tidak mengikuti instruksi dari isi listing, tidak login ke akun pengguna, dan tidak membuat bukti baru. Ia hanya merangkum sinyal dari data publik yang berhasil diperiksa.</p>
            </div>
            <div className="agent-credentials">
              <span><b>ANONIM</b> Browser terisolasi</span>
              <span><b>TERSTRUKTUR</b> Setiap temuan bersumber</span>
              <span><b>TERBATAS</b> Tidak melewati CAPTCHA</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
