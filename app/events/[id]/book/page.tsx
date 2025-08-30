"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, ArrowLeft, CreditCard, User, AlertCircle, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Event {
  _id: string
  name: string
  description: string
  date: string
  closingDate: string
  price: number
  isFree: boolean
  location: string
  category: string
  imageUrl: string
  organizer: {
    name: string
    email: string
    phone?: string
  }
  capacity: number
  attendees: number
  status: string
  availableSpots: number
  isRegistrationOpen: boolean
}

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    quantity: 1,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else {
        setError("Event not found")
      }
    } catch (error) {
      setError("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded h-8 mb-4"></div>
            <div className="bg-muted rounded-lg h-96"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted mb-8">The event you’re trying to book doesn’t exist.</p>
          <Link href="/"><Button>Back to Events</Button></Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  const totalPrice = event.price * formData.quantity
  const isSoldOut = event.attendees >= event.capacity

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 1 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const customerInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          quantity: formData.quantity,
          customerInfo,
          paymentMethod: event.isFree ? undefined : {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          },
        }),
      })

      const result = await response.json()
      if (result.success) {
        sessionStorage.setItem("bookingInfo", JSON.stringify({ ...customerInfo, eventId: event._id }))
        router.push(`/tickets/${result.booking.ticketIds[0]}`)
      } else setError(result.message || "Booking failed. Please try again.")
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSoldOut) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Sold Out</h1>
          <p className="text-muted mb-8">Unfortunately, this event is sold out.</p>
          <Link href={`/events/${event._id}`}><Button>Back to Event</Button></Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back Button */}
        <Link href={`/events/${event._id}`} className="inline-flex items-center gap-2 text-muted hover:text-accent mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Event
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold mb-2">{event.isFree ? "Get Your Free Ticket" : "Book Your Tickets"}</h1>
            <p className="text-muted">Secure your spot by completing the form below.</p>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" /> <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <Card>
                <CardHeader><CardTitle><User className="h-5 w-5 mr-2 inline" />Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required /></div>
                    <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required /></div>
                  </div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} /></div>
                </CardContent>
              </Card>

              {/* Tickets */}
              <Card>
                <CardHeader><CardTitle>Tickets</CardTitle></CardHeader>
                <CardContent>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" min="1" max="10" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-24 mt-2" />
                  <p className="text-xs text-muted mt-1">Max 10 per booking</p>
                </CardContent>
              </Card>

              {/* Payment */}
              {!event.isFree && (
                <Card>
                  <CardHeader><CardTitle><CreditCard className="h-5 w-5 mr-2 inline" /> Payment</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="text-sm"><AlertCircle className="h-4 w-4" /> Use test card: 4242 4242 4242 4242</Alert>
                    <Input name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleInputChange} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange} required />
                      <Input name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange} required />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? "Processing..." : event.isFree ? "Get Free Ticket" : `Pay $${totalPrice} & Book`}
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img src={event.imageUrl || "/placeholder.svg"} alt={event.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold text-sm">{event.name}</h3>
                    <p className="text-xs text-muted flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(event.date)}</p>
                    <p className="text-xs text-muted flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span>{event.isFree ? "Free Ticket" : "Ticket"} × {formData.quantity}</span>
                  <span>{event.isFree ? "FREE" : `$${event.price * formData.quantity}`}</span>
                </div>

                {!event.isFree && (
                  <>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </>
                )}

                {event.isFree && <Badge className="bg-green-500">FREE EVENT</Badge>}

                <div className="text-xs text-muted text-center border-t pt-3">
                  <div className="flex justify-center items-center gap-1"><Lock className="h-3 w-3 text-green-500" /> Secure Payment</div>
                  <p>Your details are safe and encrypted</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
