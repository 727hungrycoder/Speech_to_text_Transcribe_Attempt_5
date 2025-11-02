// audio-processor.js

// REMOVE: import { AudioWorkletProcessor, registerProcessor } from "audio-worklet"

class AudioProcessor extends AudioWorkletProcessor { // AudioWorkletProcessor is globally available
    process(inputs, outputs) {
        const input = inputs[0]
        if (!input || input.length === 0) return true

        const channelData = input[0]

        // Convert Float32 -> Int16 PCM
        const buffer = new ArrayBuffer(channelData.length * 2)
        const view = new DataView(buffer)

        for (let i = 0; i < channelData.length; i++) {
            const s = Math.max(-1, Math.min(1, channelData[i]))
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
        }

        // Send PCM chunk to main thread
        this.port.postMessage(buffer)
        return true
    }
}

registerProcessor("audio-processor", AudioProcessor) // registerProcessor is globally available