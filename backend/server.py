import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import numpy as np

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model
# Options: tiny, base, small, medium, large-v2
# Use 'base' for good balance of speed and accuracy
model = WhisperModel("base", device="cpu", compute_type="int8")

# Audio buffer settings
SAMPLE_RATE = 16000
CHUNK_DURATION = 2  # seconds
CHUNK_SIZE = SAMPLE_RATE * CHUNK_DURATION


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection opened")

    audio_buffer = bytearray()

    try:
        while True:
            # Receive PCM audio data from client
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)

            # Process when we have enough audio data
            if len(audio_buffer) >= CHUNK_SIZE * 2:  # *2 because Int16 = 2 bytes
                # Convert bytes to numpy array
                audio_int16 = np.frombuffer(
                    bytes(audio_buffer[: CHUNK_SIZE * 2]), dtype=np.int16
                )

                # Convert Int16 to Float32 normalized to [-1, 1]
                audio_float32 = audio_int16.astype(np.float32) / 32768.0

                # 👇 FIX: Run the synchronous, CPU-bound task in a separate thread
                # This prevents blocking the event loop and fixes the WebSocket timeout.
                segments, info = await asyncio.to_thread(
                    model.transcribe,
                    audio_float32,
                    beam_size=5,
                    language="en",  # English-only transcriber  # Remove this  line for multilingual support
                    vad_filter=True,  # Voice activity detection
                )

                # Send transcription back to client
                for segment in segments:
                    if segment.text.strip():
                        await websocket.send_json(
                            {
                                "text": segment.text.strip(),
                                "start": segment.start,
                                "end": segment.end,
                            }
                        )
                        print(f"Transcribed: {segment.text.strip()}")

                # Clear processed audio from buffer
                audio_buffer = audio_buffer[CHUNK_SIZE * 2 :]

    except WebSocketDisconnect:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()


@app.get("/")
async def root():
    return {
        "message": "Live Speech Transcription API",
        "websocket": "/ws",
        "status": "running",
    }


if __name__ == "__main__":
    import uvicorn

    print("Starting FastAPI server on http://localhost:8000")
    print("WebSocket endpoint: ws://localhost:8000/ws")
    uvicorn.run(app, host="0.0.0.0", port=8000)
