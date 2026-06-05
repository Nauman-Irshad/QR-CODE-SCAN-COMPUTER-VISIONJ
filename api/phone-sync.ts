import { head, put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function blobKey(sessionId: string) {
  return `phone-sync/${sessionId}.jpg`;
}

function corsJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: cors });
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session") || "";
  if (!sessionId) {
    return corsJson({ error: "session required" }, 400);
  }
  try {
    const meta = await head(blobKey(sessionId));
    return corsJson({ ready: !!meta?.url, image_url: meta.url || null });
  } catch {
    return corsJson({ ready: false, image_url: null });
  }
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session") || "";
  const isUpload = url.searchParams.get("upload") === "1";

  if (isUpload) {
    if (!sessionId || sessionId.length > 64) {
      return corsJson({ error: "Invalid session" }, 400);
    }
    const form = await req.formData();
    const photo = form.get("photo");
    if (!photo || !(photo instanceof Blob)) {
      return corsJson({ error: "Missing photo" }, 400);
    }
    const uploaded = await put(blobKey(sessionId), photo, {
      access: "public",
      addRandomSuffix: false,
      contentType: photo.type || "image/jpeg",
    });
    return corsJson({ status: "ok", image_url: uploaded.url });
  }

  const newSessionId = crypto.randomUUID().replace(/-/g, "");
  return corsJson({ session_id: newSessionId });
}
