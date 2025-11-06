# Live Speech Transcription - Setup Guide


The faster whisper requires python 3.10 or lesser version.

This project provides real-time speech-to-text transcription using a Next.js frontend and Python FastAPI backend with faster-whisper.

**⚠️ Important Note for v0 Users:**
The v0 preview environment only runs the frontend (Next.js) in the browser. The Python backend cannot run in v0's preview preview. To test the full transcription functionality, you must download this project and run both the frontend and backend locally on your machine.

## Project Structure

\`\`\`
live-speech-transcription/
├── app/
│   ├── page.tsx                # Main transcription UI component
│   └── globals.css             # Global styles and design tokens
├── public/
│   └── audio-processor.js      # AudioWorklet processor for PCM conversion
├── backend/
│   ├── server.py               # FastAPI WebSocket server (runs separately)
│   └── requirements.txt        # Python dependencies
├── package.json                # Node.js dependencies
└── SETUP.md                    # This file
\`\`\`

## How It Works

1. **Frontend (Next.js)**: Captures audio from your microphone using the Web Audio API and AudioWorklet, converts it to PCM format, and sends it via WebSocket
2. **Backend (Python)**: Receives audio data, processes it with the Whisper AI model, and sends back transcribed text in real-time
3. **Communication**: WebSocket connection between frontend and backend for low-latency streaming

## Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.8 or higher
- **pip**: Python package manager
- **Microphone**: Required for audio input

## Installation & Setup

### Option 1: Download from v0 (Recommended)

1. Click the three dots in the top right of the v0 interface
2. Select "Download ZIP" or push to GitHub
3. Extract the files to your local machine
4. Follow the steps below to run both frontend and backend

### Option 2: Manual Setup

If you already have the files, proceed with the installation steps below.

### Step 1: Install Frontend Dependencies

\`\`\`bash
# From the project root directory
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
\`\`\`

**Key Dependencies:**
- `next`: React framework
- `react`: UI library
- `lucide-react`: Icon library
- `tailwindcss`: Styling
- `@radix-ui/*`: UI component primitives

### Step 2: Install Backend Dependencies

\`\`\`bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
py -3.10 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
\`\`\`

**Key Dependencies:**
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `websockets`: WebSocket support
- `faster-whisper`: Speech recognition model (downloads ~150MB on first run)
- `numpy`: Numerical operations

**Note**: The first time you run the backend, faster-whisper will download the Whisper model files (~150MB for the base model). This is a one-time download.

## Running the Application

You need to run BOTH the backend and frontend simultaneously in separate terminal windows.

### Terminal 1: Start the Python Backend

\`\`\`bash
# Navigate to backend directory
cd backend

# Activate virtual environment if not already activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run the server
python server.py
\`\`\`

**Expected Output:**
\`\`\`
Starting FastAPI server on http://localhost:8000
WebSocket endpoint: ws://localhost:8000/ws
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
\`\`\`

The WebSocket server is now running on `ws://localhost:8000/ws`

### Terminal 2: Start the Frontend Development Server

\`\`\`bash
# From the project root directory (in a NEW terminal)
npm run dev

# Or
yarn dev

# Or
pnpm dev
\`\`\`

**Expected Output:**
\`\`\`
▲ Next.js 15.x.x
- Local:        http://localhost:3000
\`\`\`

The application will be available at `http://localhost:3000`

### Step 3: Use the Application

1. Open your browser to `http://localhost:3000`
2. You should see "Disconnected" status initially
3. Click the microphone button to start recording
4. Grant microphone permissions when prompted by your browser
5. The status should change to "Connected" (green)
6. Speak clearly into your microphone
7. Watch real-time transcription appear in the transcript area below
8. Click the button again to stop recording

## Configuration

### Audio Settings

The frontend captures audio with these settings (in `app/page.tsx`):

\`\`\`typescript
{
  channelCount: 1,        // Mono audio
  sampleRate: 16000,      // 16kHz (required by Whisper)
  echoCancellation: true, // Reduce echo
  noiseSuppression: true  // Reduce background noise
}
\`\`\`

### Whisper Model Selection

The backend uses the `base` model by default. You can change this in `backend/server.py`:

\`\`\`python
model = WhisperModel("base", device="cpu", compute_type="int8")
\`\`\`

Available models (larger = more accurate but slower):
- `tiny`: Fastest, least accurate (~75MB)
- `base`: Good balance - **default** (~150MB)
- `small`: Better accuracy (~500MB)
- `medium`: High accuracy (~1.5GB)
- `large-v2`: Best accuracy, slowest (~3GB)

**Note**: Larger models require more RAM and processing time. Start with `base` and upgrade if needed.

### Language Detection

By default, the backend is set to English. To enable auto-detection in `backend/server.py`:

\`\`\`python
segments, info = model.transcribe(
    audio_float32,
    beam_size=5,
    language=None,  # Change "en" to None for auto-detection
    vad_filter=True,
)
\`\`\`

### WebSocket URL

If your backend runs on a different port or host, update the WebSocket URL in `app/page.tsx`:

\`\`\`typescript
const ws = new WebSocket("ws://localhost:8000/ws")
// Change to your backend URL, e.g., "ws://192.168.1.100:8000/ws"
\`\`\`

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'faster_whisper'`
- **Solution**: Activate the virtual environment and run `pip install -r requirements.txt`

**Problem**: WebSocket connection refused / "Disconnected" status
- **Solution**: 
  - Ensure the Python backend server is running in a separate terminal
  - Check that it's running on port 8000
  - Look for "Uvicorn running on http://0.0.0.0:8000" in the backend terminal

**Problem**: Slow transcription or high CPU usage
- **Solution**: 
  - Use a smaller Whisper model (`tiny` or `base`)
  - Increase `CHUNK_DURATION` in `server.py` (e.g., from 2 to 3 seconds)
  - Consider using GPU acceleration if available (change `device="cpu"` to `device="cuda"`)

**Problem**: Model download fails
- **Solution**: Check your internet connection. The model downloads from Hugging Face on first run.

### Frontend Issues

**Problem**: Microphone permission denied
- **Solution**: 
  - Check browser settings and grant microphone access
  - Try using HTTPS or localhost (some browsers require secure context)
  - Check browser console for specific error messages

**Problem**: AudioWorklet not loading
- **Solution**: 
  - Ensure `public/audio-processor.js` exists
  - Verify the dev server is running
  - Check browser console for errors

**Problem**: No transcription appearing despite "Connected" status
- **Solution**: 
  - Check the backend terminal for transcription logs
  - Verify audio is being captured (check browser's microphone indicator)
  - Try speaking louder or closer to the microphone
  - Check backend logs for errors

**Problem**: "WebSocket connection timeout"
- **Solution**: 
  - Ensure backend is running BEFORE clicking the record button
  - Check firewall settings aren't blocking port 8000
  - Try restarting both frontend and backend

### Browser Compatibility

This application works best in:
- ✅ Chrome/Edge (Chromium-based) - Recommended
- ✅ Firefox
- ⚠️ Safari (may have AudioWorklet limitations)

## Development

### Frontend Development

\`\`\`bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Backend Development

\`\`\`bash
# Run with auto-reload
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
\`\`\`

## Production Deployment

### Frontend

Deploy to Vercel (recommended):
\`\`\`bash
vercel deploy
\`\`\`

Or build and deploy elsewhere:
\`\`\`bash
npm run build
npm start
\`\`\`

### Backend

Deploy using:
- **Docker**: Containerize the backend for easy deployment
- **AWS EC2/Lambda**: Host the Python server
- **Google Cloud Run**: Serverless container deployment
- **DigitalOcean/Heroku**: Traditional hosting

**Important for Production:**
- Update CORS settings in `server.py` to allow only your frontend domain
- Use environment variables for configuration
- Consider using a reverse proxy (nginx) for WebSocket connections
- Ensure sufficient CPU/RAM for the Whisper model
- Use HTTPS/WSS for secure connections

## Architecture Notes

### Why Separate Backend?

The Whisper AI model requires Python and significant computational resources. Running it in a separate backend allows:
- Better performance and resource management
- Ability to use GPU acceleration
- Scalability (multiple frontends can connect to one backend)
- Flexibility to upgrade or swap the transcription engine

### Audio Processing Flow

1. **Browser** → Captures microphone audio via `getUserMedia()`
2. **AudioWorklet** → Converts audio to 16kHz mono PCM format
3. **WebSocket** → Streams PCM data to backend
4. **Backend** → Buffers audio and processes with Whisper
5. **WebSocket** → Sends transcribed text back to frontend
6. **UI** → Displays transcription in real-time

## Performance Tips

- Use the `base` model for real-time performance
- Enable VAD (Voice Activity Detection) to skip silence
- Adjust `CHUNK_DURATION` to balance latency vs accuracy
- Consider GPU acceleration for larger models
- Use a wired internet connection for stable WebSocket

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console logs (F12 → Console)
3. Check Python backend terminal output
4. Verify all dependencies are installed correctly
5. Ensure both frontend and backend are running simultaneously
</merged_code




Node JS installation

Install Node.js (includes npm): download the Windows LTS installer from https://nodejs.org/ and run the installer.
Verify installation: open a new PowerShell (important — a new session) and run: node -v and npm -v. Both should print versions.
If npm still is not found but Node is installed, add npm to PATH: open Start → Settings → System → About → Advanced system settings → Environment Variables → under "System variables" edit "Path" → New → add the Node install folder (usually C:\Program Files\nodejs) → OK. Then restart PowerShell and VS Code.
If you use nvm-windows, run nvm use <version> in a new terminal session to activate that Node version.
Optionally tell VS Code where npm is (useful for custom installs): set typescript.npm to the full npm executable path (e.g. C:\Program Files\nodejs\npm.cmd) and keep typescript.check.npmIsInstalled enabled to have VS Code check for npm.

# Add NodeJS to user PATH and apply for future sessions
[Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\Program Files\nodejs', 'User')

node -v
npm -v

# Install all deps from package.json
npm install

# Install a package and save to dependencies (default)
npm install lodash

# Install a dev-only package
npm install --save-dev jest
# shorthand
npm install -D jest

# Global install (system-wide CLI)
npm install -g typescript

# For CI / reproducible, faster clean install using package-lock.json
npm ci



New setup.md file

# Setup Instructions

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- 4GB+ RAM (8GB+ recommended)
- Microphone access for audio capture

## Installation Steps

### 1. Clone and Install Frontend Dependencies

\`\`\`bash
# Install Node.js dependencies
npm install
\`\`\`

### 2. Install Python Backend Dependencies

\`\`\`bash
# Create a Python virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
\`\`\`

### 3. Start the Backend Server

The backend runs as a FastAPI WebSocket server. You have two options:

#### Option A: Run Locally (Development)

\`\`\`bash
# From the project root, start the FastAPI server
uvicorn app.api.ws.route:app --host 0.0.0.0 --port 8000 --reload

# The server will be available at http://localhost:8000
# WebSocket endpoint: ws://localhost:3000/ws/...
\`\`\`

**Important**: The Next.js app expects the WebSocket endpoint at `ws://localhost:3000/ws/...`. You'll need to proxy WebSocket requests from Next.js to your FastAPI server or run both on the same port using Next.js API routes.

#### Option B: Integrate with Next.js (Recommended for Development)

Move the `app/api/ws/route.py` logic into a Next.js API route at `app/api/ws/route.ts`:

\`\`\`typescript
import { NextRequest } from 'next/server';
// Import and use the FastAPI WebSocket handler
\`\`\`

However, Next.js's built-in WebSocket support is limited. For production, use a separate FastAPI server.

### 4. Start the Frontend Development Server

\`\`\`bash
# In a new terminal
npm run dev

# The app will be available at http://localhost:3000
\`\`\`

### 5. Use the Application

1. Open http://localhost:3000 in your browser
2. Grant microphone permissions when prompted
3. Click "Start Listening" to begin transcription
4. Speak clearly into your microphone
5. See real-time partial transcripts and final results
6. Click "Stop" to end the session
7. Click "Clear" to reset the transcript

## First Run

⚠️ **First Run Note**: On the first run, Faster-Whisper will download the model (~500MB). This takes 30-60 seconds depending on your internet connection. Subsequent runs will use the cached model.

## Environment Variables

No additional environment variables are required for basic functionality. The app uses:
- `process.env.NODE_ENV` (automatic)
- `NEXT_PUBLIC_*` variables (if adding features)

## Production Deployment

For production, consider:

1. **Backend**: Deploy FastAPI to a service like Render, Railway, or AWS Lambda
2. **Frontend**: Deploy Next.js to Vercel, Netlify, or your preferred host
3. **CORS**: Configure CORS on FastAPI for your frontend domain
4. **Model Caching**: Use a persistent volume to cache the Whisper model
5. **Monitoring**: Add logging and error tracking

### Example Production Deployment

\`\`\`bash
# Build the Next.js app
npm run build

# Deploy frontend to Vercel
vercel deploy

# Deploy backend to a cloud service
# Configure WebSocket endpoint in frontend to point to production backend
\`\`\`

## Troubleshooting

### "ModuleNotFoundError: No module named 'faster_whisper'"

\`\`\`bash
# Ensure you activated the virtual environment and installed requirements
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

### "WebSocket connection failed"

- Check that the backend is running on the correct host/port
- Verify CORS settings if backend and frontend are on different domains
- Check browser console for detailed error messages

### "Microphone permission denied"

- Check browser permissions for the site
- On macOS, go to System Preferences > Security & Privacy > Microphone
- On Windows, go to Settings > Privacy & Security > Microphone

### "OutOfMemoryError"

- Reduce the model size (use `tiny` or `base` instead of larger models)
- Close other applications to free up RAM
- Increase system swap/virtual memory

### High CPU Usage / Slow Transcription

This is normal for CPU-based processing. To improve:
- Use a smaller Whisper model size
- Increase audio chunk processing time
- Upgrade to a machine with more CPU cores

## Next Steps

- Customize the model size in the backend
- Add authentication for multi-user support
- Implement transcript storage and history
- Add language detection and multi-language support
- Deploy to production infrastructure


Step-by-Step Guide
🪄 1. Make sure Python 3.10 is installed

After running the setup script (or manually installing 3.10), verify with:

python3.10 --version


You should see something like:

Python 3.10.11

⚙️ 2. Open the Command Palette in VS Code

Press:

Ctrl + Shift + P


(Or on Mac: Cmd + Shift + P)

🧩 3. Search for “Python: Select Interpreter”

Type and select:

Python: Select Interpreter

PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> python --version
Python 3.14.0
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> py -3.10 -m venv venv
PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> .\venv\Scripts\Activate
(venv) PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> python --version
Python 3.10.0
(venv) PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> 



 npm run dev

> my-v0-project@0.1.0 dev
> next dev

   ▲ Next.js 16.0.0 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.63:3000

 ✓ Starting...
 ✓ Ready in 3.6s
 ○ Compiling / ...
 GET / 200 in 5.8s (compile: 5.4s, render: 379ms)
 GET / 200 in 144ms (compile: 10ms, render: 134ms)
 GET / 200 in 139ms (compile: 8ms, render: 131ms)



 (.venv) PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5\backend> python server.py
Starting FastAPI server on http://localhost:8000
WebSocket endpoint: ws://localhost:8000/ws
INFO:     Started server process [14000]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)

PS C:\Users\Raj\OneDrive\Desktop\Developer\CARMY_AI_FILES_Internship_2025\Speech_to_text_Transcribe_Attempt_5> npm run dev

> my-v0-project@0.1.0 dev
> next dev

   ▲ Next.js 16.0.0 (Turbopack)
   - Local:        http://localhost:3000   
   - Network:      http://192.168.1.63:3000

 ✓ Starting...
 ✓ Ready in 3s

