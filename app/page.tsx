"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Wifi, WifiOff } from "lucide-react"

export default function TranscriptionPage() {
    const [isRecording, setIsRecording] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [transcript, setTranscript] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const workletNodeRef = useRef<AudioWorkletNode | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            stopRecording()
        }
    }, [])

    const startRecording = async () => {
        try {
            setError(null)

            // Connect WebSocket
            const ws = new WebSocket("ws://localhost:8000/ws")
            wsRef.current = ws

            ws.onopen = () => {
                console.log("[v0] WebSocket connected")
                setIsConnected(true)
            }

            ws.onmessage = (event) => {
                console.log("[v0] Received message:", event.data)
                const data = JSON.parse(event.data)
                if (data.text) {
                    setTranscript((prev) => [...prev, data.text])
                }
            }

            ws.onerror = (error) => {
                console.error("[v0] WebSocket error:", error)
                setError("WebSocket connection error")
                setIsConnected(false)
            }

            ws.onclose = () => {
                console.log("[v0] WebSocket closed")
                setIsConnected(false)
            }

            // Wait for WebSocket to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("WebSocket connection timeout")), 5000)
                ws.onopen = () => {
                    clearTimeout(timeout)
                    setIsConnected(true)
                    resolve(true)
                }
                ws.onerror = () => {
                    clearTimeout(timeout)
                    reject(new Error("WebSocket connection failed"))
                }
            })

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            })
            streamRef.current = stream

            // Create AudioContext
            const audioContext = new AudioContext({ sampleRate: 16000 })
            audioContextRef.current = audioContext

            // Load AudioWorklet
            await audioContext.audioWorklet.addModule("/audio-processor.js")

            // Create AudioWorkletNode
            const source = audioContext.createMediaStreamSource(stream)
            const workletNode = new AudioWorkletNode(audioContext, "audio-processor")
            workletNodeRef.current = workletNode

            // Handle audio data from worklet
            workletNode.port.onmessage = (event) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(event.data)
                }
            }

            // Connect audio nodes
            source.connect(workletNode)
            workletNode.connect(audioContext.destination)

            setIsRecording(true)
        } catch (err) {
            console.error("[v0] Error starting recording:", err)
            setError(err instanceof Error ? err.message : "Failed to start recording")
            stopRecording()
        }
    }

    const stopRecording = () => {
        // Close WebSocket
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }

        // Stop audio worklet
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect()
            workletNodeRef.current = null
        }

        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }

        // Stop media stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        setIsRecording(false)
        setIsConnected(false)
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-balance">Live Speech Transcription</h1>
                    <p className="text-muted-foreground text-lg">Real-time audio transcription powered by Whisper</p>
                </div>

                {/* Controls Card */}
                <Card className="p-8">
                    <div className="flex flex-col items-center gap-6">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-3">
                            {isConnected ? (
                                <>
                                    <Wifi className="h-5 w-5 text-emerald-500" />
                                    <span className="text-sm font-medium text-emerald-500">Connected</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">Disconnected</span>
                                </>
                            )}
                        </div>

                        {/* Record Button */}
                        <Button
                            size="lg"
                            onClick={toggleRecording}
                            className={`h-24 w-24 rounded-full transition-all ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
                                }`}
                        >
                            {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                        </Button>

                        <p className="text-sm text-muted-foreground">
                            {isRecording ? "Click to stop recording" : "Click to start recording"}
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="w-full p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive text-center">{error}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Transcript Card */}
                <Card className="p-8 min-h-[400px]">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Transcript</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {transcript.length === 0 ? (
                                <p className="text-muted-foreground text-center py-12">
                                    Start recording to see transcription appear here...
                                </p>
                            ) : (
                                transcript.map((text, index) => (
                                    <div key={index} className="p-4 bg-accent/50 rounded-lg border border-border">
                                        <p className="text-foreground leading-relaxed">{text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Card>

                {/* Instructions */}
                <Card className="p-6 bg-muted/50">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Setup Instructions:</h3>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Ensure your Python WebSocket server is running on localhost:8000</li>
                            <li>Grant microphone permissions when prompted</li>
                            <li>Click the microphone button to start recording</li>
                            <li>Speak clearly and watch the transcription appear in real-time</li>
                        </ol>
                    </div>
                </Card>
            </div>
        </div>
    )
}
