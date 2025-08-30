"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeComponent({ value, size = 128, className = "" }: QRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#1f2937", // foreground color
            light: "#ffffff", // background color
          },
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error("QR Code generation error:", error)
      }
    }

    generateQRCode()
  }, [value, size])

  if (!qrCodeUrl) {
    return <div className={`${className} bg-gray-200 animate-pulse`} style={{ width: size, height: size }} />
  }

  return <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className={className} width={size} height={size} />
}
