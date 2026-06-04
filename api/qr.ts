export const config = { runtime: "edge" };

/** PNG QR for current page URL (phone opens same deploy). */
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const target = `${url.origin}${url.searchParams.get("to") || "/"}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(target)}`;
  const img = await fetch(qrApi);
  return new Response(await img.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
    },
  });
}
