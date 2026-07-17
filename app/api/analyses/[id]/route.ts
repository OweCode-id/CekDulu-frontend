const DEFAULT_BACKEND_URL = "http://127.0.0.1:8080";

function backendUrl(path: string): string {
  const baseUrl = (
    process.env.CEKDULU_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_BACKEND_URL
  ).replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  try {
    const response = await fetch(
      backendUrl(`/api/v1/analyses/${encodeURIComponent(id)}/`),
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    const payload = await response.text();

    return new Response(payload, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    });
  } catch {
    return Response.json(
      { message: "Backend CekDulu tidak dapat dihubungi. Pastikan Django berjalan." },
      { status: 502 },
    );
  }
}
