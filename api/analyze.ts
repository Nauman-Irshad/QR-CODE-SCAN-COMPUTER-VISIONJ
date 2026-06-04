import { put } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const CORE_POSE_INDICES = [0, 11, 12, 23, 24, 27, 28];

type Kp = { visibility?: number; x?: number; y?: number; z?: number; name?: string };

function scoreHuman(keypoints: Kp[]) {
  if (!keypoints || keypoints.length < 33) {
    return {
      human_detected: false,
      human_probability: 0,
      strong_core: 0,
      avg_core_visibility: 0,
      avg_all_visibility: 0,
      landmarks: [] as object[],
    };
  }

  const visAll = keypoints.slice(0, 33).map((k) => Number(k.visibility ?? 0));
  const avgAll = visAll.reduce((a, b) => a + b, 0) / 33;
  const coreVis = CORE_POSE_INDICES.map((i) => Number(keypoints[i]?.visibility ?? 0));
  const avgCore = coreVis.reduce((a, b) => a + b, 0) / coreVis.length;
  const strong = coreVis.filter((v) => v >= 0.4).length;
  const prob = Math.min(1, 0.25 * avgAll + 0.45 * avgCore + 0.3 * (strong / CORE_POSE_INDICES.length));
  const human_detected = prob >= 0.42 && strong >= 4;

  const landmarks = keypoints.slice(0, 33).map((kp, idx) => ({
    id: idx,
    name: kp.name || `landmark_${idx}`,
    x: Number(kp.x ?? 0),
    y: Number(kp.y ?? 0),
    z: Number(kp.z ?? 0),
    visibility: Number(kp.visibility ?? 0),
  }));

  return {
    human_detected,
    human_probability: +prob.toFixed(4),
    strong_core: strong,
    avg_core_visibility: +avgCore.toFixed(4),
    avg_all_visibility: +avgAll.toFixed(4),
    landmarks,
  };
}

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

    let landmarks_data: object[] = [];
    let human_detected = false;
    let human_probability = 0;
    let strong_core = 0;
    let avg_core_visibility = 0;
    let avg_all_visibility = 0;
    let used_browser_pose = false;

    const poseJsonRaw = form.get("pose_json");
    if (typeof poseJsonRaw === "string" && poseJsonRaw.trim()) {
      try {
        const poseData = JSON.parse(poseJsonRaw) as { keypoints?: Kp[] };
        const keypoints = poseData.keypoints || [];
        if (keypoints.length >= 33) {
          used_browser_pose = true;
          const scored = scoreHuman(keypoints);
          human_detected = scored.human_detected;
          human_probability = scored.human_probability;
          strong_core = scored.strong_core;
          avg_core_visibility = scored.avg_core_visibility;
          avg_all_visibility = scored.avg_all_visibility;
          landmarks_data = scored.landmarks;
        }
      } catch {
        /* ignore bad pose_json */
      }
    }

    const msg = used_browser_pose
      ? "Image processed using live browser pose (33 landmarks)"
      : "Image saved — use live body dots before capture for best results";

    return corsJson({
      message: msg,
      saved_filename: filename,
      image_url: blob.url,
      human_detected,
      human_probability,
      strong_core_landmarks: strong_core,
      avg_core_visibility,
      avg_all_visibility,
      landmarks_count: landmarks_data.length,
      landmarks: landmarks_data,
    });
  } catch (e) {
    return corsJson({ error: e instanceof Error ? e.message : "Analyze failed" }, 500);
  }
}
