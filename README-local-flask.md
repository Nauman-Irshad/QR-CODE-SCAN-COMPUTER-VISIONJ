# Computer Vision (Camera Work)

Live full-body pose capture with **MediaPipe BlazePose** (33 landmarks). Browser runs pose in real time; Flask re-analyzes the captured JPEG on `POST /analyze`.

## Quick start (Windows)

```powershell
cd "E:\fyp whole backend\Computer Vision (Camera Work)"
pip install -r requirements.txt
python app.py
```

Open **http://127.0.0.1:5000/** in Edge or Chrome (allow camera).

Or double-click **`RUN_CAMERA_LANDMARK.bat`**.

| Variable | Default |
|----------|---------|
| Port | `5000` — set `CAMERA_APP_PORT=5050` if busy |
| HTTPS | Set `SMARTFITAO_SSL=1` for phone on Wi‑Fi |

## Stack

- Python 3, Flask 3, MediaPipe Pose, OpenCV
- Browser: MediaPipe JS (Pose, camera utils)

## Docs

- LaTeX overview: `docs/Computer_Vision_Camera_Work_Overview.tex`
- Full workspace guide: `E:\fyp whole backend\README.md`

## Not on Vercel

This module runs **locally** (or on your own server). Captured images feed 2D try-on / measurement flows in the main FYP apps.
