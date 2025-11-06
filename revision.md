https://medium.com/@johnidouglasmarangon/build-a-speech-to-text-service-in-python-with-faster-whisper-39ad3b1e2305

Three years ago, I developed a speech-to-text system integrated with a video recorder used for recording court hearings in Brazil. The solution was optimized to operate efficiently on limited CPU resources and minimize memory usage. To address this challenge, I utilized Vosk, a lightweight speech recognition toolkit, which delivered satisfactory performance.

With advancements in large language models (LLMs) and Transformers, a promising solution has emerged: Whisper, a versatile speech recognition model that excels at this task. However, achieving optimal performance requires the use of GPUs.

After spending several days exploring how Whisper operates and seeking ways to enhance transcription quality, I discovered the Faster Whisper project. This project helps maintain affordable hardware requirements for app users.

What is Whisper and Faster Whisper?
Whisper, developed by OpenAI, is an advanced open-source automatic speech recognition (ASR) system designed for high-accuracy transcription across multiple languages. Trained on a diverse multilingual dataset, Whisper excels at transcribing, translating, and identifying spoken language. Its encoder-decoder Transformer architecture enables robust performance in noisy environments, overlapping speech, and complex audio inputs.

However, Whisper’s flexibility is accompanied by high computational demands. Its models range from Tiny to Large and require substantial resources for efficient operation, particularly in real-time applications.

Faster Whisper is an optimized version of Whisper, designed to provide faster inference with reduced resource consumption. It is especially beneficial in scenarios where performance and speed are important but not critical. Faster Whisper balances maintaining the original model’s accuracy while meeting the needs of contemporary high-performance applications.

Why did I choose Faster Whisper?
Cost was a significant consideration. The application runs on-premise, and customers have been utilizing an affordable infrastructure solution for years, logging thousands of recorded hours monthly. Transitioning to an API-based solution or using GPUs would increase costs. Therefore, the challenge was to enhance quality while keeping expenses low.

https://github.com/AIXerum/faster-whisper

WhisperLive is a nearly-live implementation of OpenAI's Whisper which uses faster-whisper as the backend to transcribe audio in real-time.
