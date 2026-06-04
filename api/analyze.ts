import { put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

function corsJson(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/** Simple image upload (no pose / CV). Used by website /cv-camera/analyze proxy. */
export async function POST(req: Request): Promise<Response> {
  try {
    const form = await req.formData();
    const image = form.get("image");
    if (!image || !(image instanceof Blob)) {
      return corsJson({ error: "No image part in the request" }, 400);
    }

    const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const filename = `capture_${ts}.jpg`;

    const blob = await put(`captures/${filename}`, image, {
      access: "public",
      contentType: image.type || "image/jpeg",
    });

    return corsJson({
      message: "Photo saved",
      saved_filename: filename,
      image_url: blob.url,
      human_detected: true,
      simple_mode: true,
      landmarks_count: 0,
    });
  } catch (e) {
    return corsJson({ error: e instanceof Error ? e.message : "Upload failed" }, 500);
  }
}
