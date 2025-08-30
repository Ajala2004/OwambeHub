"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QrCode, CheckCircle, XCircle, AlertCircle, Calendar, User } from "lucide-react"

interface TicketInfo {
  id: string
  eventName: string
  eventDate: string
  holderName: string
  ticketNumber: number
  status: "valid" | "used" | "expired" | "invalid"
}

export default function VerifyPage() {
  const [ticketId, setTicketId] = useState("")
  const [eventId, setEventId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean
    ticket?: TicketInfo
    error?: string
  } | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setVerificationResult(null)

    try {
      const response = await fetch("/api/verify-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: ticketId.trim(),
          eventId: eventId.trim(),
        }),
      })

      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({
        valid: false,
        error: "Network error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-500 hover:bg-green-600">Valid</Badge>
      case "used":
        return <Badge variant="secondary">Already Used</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "invalid":
        return <Badge variant="destructive">Invalid</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (valid: boolean, status?: string) => {
    if (valid && status === "valid") {
      return <CheckCircle className="h-8 w-8 text-green-600" />
    }
    if (!valid || status === "used" || status === "expired") {
      return <XCircle className="h-8 w-8 text-red-600" />
    }
    return <AlertCircle className="h-8 w-8 text-yellow-600" />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <QrCode className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Ticket Verification</h1>
          <p className="text-muted">Verify event tickets by entering the ticket details or scanning QR codes.</p>
        </div>

        {/* Verification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verify Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticketId">Ticket ID</Label>
                <Input
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter ticket ID (e.g., ticket_1234567890_1_abc123)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventId">Event ID</Label>
                <Input
                  id="eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  placeholder="Enter event ID (e.g., 1, 2, 3)"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                {getStatusIcon(verificationResult.valid, verificationResult.ticket?.status)}
                <h2 className="text-xl font-bold text-foreground mt-2">
                  {verificationResult.valid && verificationResult.ticket?.status === "valid"
                    ? "Ticket Valid"
                    : "Ticket Invalid"}
                </h2>
              </div>

              {verificationResult.error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{verificationResult.error}</AlertDescription>
                </Alert>
              )}

              {verificationResult.ticket && (
                <div className="space-y-4">
                  <div className="flex justify-center">{getStatusBadge(verificationResult.ticket.status)}</div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium text-foreground">Event</div>
                        <div className="text-sm text-muted">{verificationResult.ticket.eventName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium text-foreground">Ticket Holder</div>
                        <div className="text-sm text-muted">{verificationResult.ticket.holderName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <QrCode className="h-4 w-4 text-accent" />
                      <div>
                        <div className="font-medium text-foreground">Ticket Details</div>
                        <div className="text-sm text-muted">
                          Ticket #{verificationResult.ticket.ticketNumber} • ID: {verificationResult.ticket.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {verificationResult.valid && verificationResult.ticket.status === "valid" && (
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>This ticket is valid for entry. Allow access to the event.</AlertDescription>
                    </Alert>
                  )}

                  {!verificationResult.valid && (
                    <Alert variant="destructive" className="mt-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        This ticket is not valid for entry. Do not allow access to the event.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>• Enter the ticket ID and event ID manually, or scan the QR code on the ticket</p>
            <p>• Valid tickets will show a green checkmark and allow entry</p>
            <p>• Invalid, used, or expired tickets will be rejected</p>
            <p>• For demo purposes, use any ticket ID starting with "ticket_" and event ID "1", "2", or "3"</p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
