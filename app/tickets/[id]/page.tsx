"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QRCodeComponent } from "@/components/qr-code"
import { Download, Calendar, MapPin, User, CheckCircle, Share2 } from "lucide-react"
import Link from "next/link"

interface TicketPageProps {
  params: {
    id: string
  }
}

interface BookingInfo {
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  quantity: number
  ticketIds: string[]
  paymentId: string
  totalPrice: number
}

export default function TicketPage({ params }: TicketPageProps) {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)

  useEffect(() => {
    // Get booking info from sessionStorage (in real app, this would come from database)
    const storedBookingInfo = sessionStorage.getItem("bookingInfo")
    if (storedBookingInfo) {
      const booking: BookingInfo = JSON.parse(storedBookingInfo)
      setBookingInfo(booking)

      // Find the index of the current ticket
      const ticketIndex = booking.ticketIds.findIndex((id) => id === params.id)
      if (ticketIndex !== -1) {
        setCurrentTicketIndex(ticketIndex)
      }
    }
  }, [params.id])

  if (!bookingInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ticket Not Found</h1>
          <p className="text-muted mb-8">The ticket you're looking for doesn't exist or has expired.</p>
          <Link href="/">
            <Button>Back to Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentTicketId = bookingInfo.ticketIds[currentTicketIndex]
  const ticketNumber = currentTicketIndex + 1

  const qrCodeData = JSON.stringify({
    ticketId: currentTicketId,
    eventId: bookingInfo.eventId,
    eventName: bookingInfo.eventName,
    holderName: `${bookingInfo.customerInfo.firstName} ${bookingInfo.customerInfo.lastName}`,
    ticketNumber: ticketNumber,
    verifyUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/verify`,
  })

  const handleDownloadTicket = () => {
    // Create a simple text version of the ticket for download
    const ticketContent = `
EVENT TICKET
============

Event: ${bookingInfo.eventName}
Date: ${formatDate(bookingInfo.eventDate)} at ${formatTime(bookingInfo.eventDate)}
Location: ${bookingInfo.eventLocation}

Ticket Holder: ${bookingInfo.customerInfo.firstName} ${bookingInfo.customerInfo.lastName}
Ticket Number: ${ticketNumber} of ${bookingInfo.quantity}
Ticket ID: ${currentTicketId}

Payment ID: ${bookingInfo.paymentId}
Total Paid: ${bookingInfo.totalPrice === 0 ? "FREE" : `$${bookingInfo.totalPrice}`}

This ticket is valid for entry to the event.
Please present this ticket at the venue.
    `.trim()

    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${currentTicketId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${bookingInfo.eventName}`,
        text: `I'm attending ${bookingInfo.eventName} on ${formatDate(bookingInfo.eventDate)}!`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Ticket link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted">
            Your ticket{bookingInfo.quantity > 1 ? "s have" : " has"} been generated successfully.
          </p>
        </div>

        {/* Ticket Navigation */}
        {bookingInfo.quantity > 1 && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              {bookingInfo.ticketIds.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentTicketIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentTicketIndex(index)}
                  className="w-12 h-12"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Ticket Display */}
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8" />
                  <div>
                    <h2 className="text-xl font-bold">Event Ticket</h2>
                    <p className="text-accent-foreground/80">
                      Ticket {ticketNumber} of {bookingInfo.quantity}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-accent-foreground">
                  {bookingInfo.totalPrice === 0 ? "FREE" : "PAID"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground text-balance">{bookingInfo.eventName}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Date & Time</div>
                      <div className="text-muted text-sm">
                        {formatDate(bookingInfo.eventDate)}
                        <br />
                        {formatTime(bookingInfo.eventDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground">Location</div>
                      <div className="text-muted text-sm">{bookingInfo.eventLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ticket Holder Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Ticket Holder
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted">Name</div>
                    <div className="font-medium text-foreground">
                      {bookingInfo.customerInfo.firstName} {bookingInfo.customerInfo.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted">Email</div>
                    <div className="font-medium text-foreground">{bookingInfo.customerInfo.email}</div>
                  </div>
                  {bookingInfo.customerInfo.phone && (
                    <div>
                      <div className="text-muted">Phone</div>
                      <div className="font-medium text-foreground">{bookingInfo.customerInfo.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Ticket Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Ticket Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted">Ticket ID</div>
                    <div className="font-mono text-xs text-foreground bg-muted/20 p-2 rounded">{currentTicketId}</div>
                  </div>
                  <div>
                    <div className="text-muted">Payment ID</div>
                    <div className="font-mono text-xs text-foreground bg-muted/20 p-2 rounded">
                      {bookingInfo.paymentId}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted">Total Paid</div>
                    <div className="font-medium text-foreground">
                      {bookingInfo.totalPrice === 0 ? "FREE" : `$${bookingInfo.totalPrice}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted">Booking Date</div>
                    <div className="font-medium text-foreground">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center py-6">
                <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                  <QRCodeComponent value={qrCodeData} size={160} />
                </div>
                <p className="text-xs text-muted mt-3">Scan this QR code at the venue for quick entry verification</p>
                <p className="text-xs text-muted">
                  Or visit{" "}
                  <Link href="/verify" className="text-accent hover:underline">
                    /verify
                  </Link>{" "}
                  to verify manually
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={handleDownloadTicket} className="flex-1" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download Ticket
            </Button>
            <Button onClick={handleShareTicket} variant="outline" className="flex-1 bg-transparent" size="lg">
              <Share2 className="h-5 w-5 mr-2" />
              Share Ticket
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Important Information</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>• Please arrive at least 15 minutes before the event starts</li>
              <li>• Bring a valid ID that matches the name on this ticket</li>
              <li>• This ticket is non-transferable and non-refundable</li>
              <li>• Screenshots of this ticket are acceptable for entry</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <Link href="/my-tickets">
              <Button variant="outline">View All My Tickets</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
