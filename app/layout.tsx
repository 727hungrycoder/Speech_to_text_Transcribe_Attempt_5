// app/layout.tsx

import type { Metadata } from "next"
import "./global.css" // Import the global styles (which you already have)

export const metadata: Metadata = {
    title: "Live Speech Transcription",
    description: "Real-time audio transcription powered by Whisper and Next.js",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}