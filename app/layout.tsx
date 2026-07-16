import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "CekDulu — Cek dulu sebelum checkout";
  const description = "Asisten investigasi belanja berbasis bukti untuk memeriksa indikasi risiko produk Tokopedia.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "id_ID",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "CekDulu — investigasi belanja berbasis bukti" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
