import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import numpy as np

app = FastAPI(
    title="Multilingual Real-Time Speech Transcription API",
    description="Supports live speech-to-text for multiple languages via WebSocket",
    version="1.0.0",
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FasterWhisper model
# Available sizes: tiny, base, small, medium, large-v2
# Use 'base' for decent multilingual balance
model = WhisperModel("base", device="cpu", compute_type="int8")

# Audio settings
SAMPLE_RATE = 16000
CHUNK_DURATION = 2  # seconds
CHUNK_SIZE = SAMPLE_RATE * CHUNK_DURATION


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🌐 WebSocket connection opened")

    audio_buffer = bytearray()
    detected_language = None  # Track language (auto-detect first time)

    try:
        while True:
            # Receive PCM audio data from frontend
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)

            # Process when enough audio is received
            if len(audio_buffer) >= CHUNK_SIZE * 2:  # Int16 = 2 bytes
                # Convert bytes to numpy array
                audio_int16 = np.frombuffer(
                    audio_buffer[: CHUNK_SIZE * 2], dtype=np.int16
                )

                # Convert Int16 to normalized Float32 (-1 to 1)
                audio_float32 = audio_int16.astype(np.float32) / 32768.0

                # Run FasterWhisper in a background thread
                def transcribe_chunk():
                    # If no language detected yet, allow auto-detection
                    return model.transcribe(
                        audio_float32,
                        beam_size=5,
                        vad_filter=True,
                        language=detected_language,  # None = auto-detect
                    )

                segments, info = await asyncio.to_thread(transcribe_chunk)

                # Store detected language (if auto-detected)
                if detected_language is None and info.language:
                    detected_language = info.language
                    print(f"🌍 Detected language: {info.language}")

                    await websocket.send_json(
                        {
                            "event": "language_detected",
                            "language": info.language,
                        }
                    )

                # Send transcribed segments
                for segment in segments:
                    if segment.text.strip():
                        await websocket.send_json(
                            {
                                "event": "transcription",
                                "text": segment.text.strip(),
                                "start": segment.start,
                                "end": segment.end,
                            }
                        )
                        print(f"📝 {segment.text.strip()}")

                # Remove processed audio from buffer
                audio_buffer = audio_buffer[CHUNK_SIZE * 2 :]

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
    except Exception as e:
        print(f"⚠️ Error: {e}")
        await websocket.close()


@app.get("/")
async def root():
    return {
        "message": "🌍 Multilingual Live Speech Transcription API",
        "websocket": "/ws",
        "supported_languages": [
            "Swedish (sv)",
            "Arabic (ar)",
            "English (en)",
            "Serbian (sr)",
            "Russian (ru)",
            "French (fr)",
            "Danish (da)",
            "Finnish (fi)",
            "Norwegian (no)",
        ],
        "status": "running",
    }


if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting FastAPI server on http://localhost:8000")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws")
    uvicorn.run(app, host="0.0.0.0", port=8000)
