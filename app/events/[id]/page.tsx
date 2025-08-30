"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Clock, User, Share2, Heart } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types/event"

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      console.error("Error fetching event:", error)
      setError("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="bg-muted rounded-lg h-80"></div>
            <div className="bg-muted rounded h-6 w-1/2"></div>
            <div className="bg-muted rounded h-4 w-2/3"></div>
            <div className="bg-muted rounded h-4 w-1/3"></div>
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
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">Event Not Found</h1>
          <p className="text-muted mb-8">This event may have been removed or is no longer available.</p>
          <Link href="/">
            <Button size="lg">Back to Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    })

  const isClosingSoon = () => {
    const closingDate = new Date(event.closingDate)
    const now = new Date()
    const daysLeft = Math.ceil((closingDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    return daysLeft <= 3 && daysLeft > 0
  }

  const isSoldOut = event.attendees >= event.capacity
  const availableSpots = event.capacity - event.attendees

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{event.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {event.isFree ? (
                  <Badge className="bg-green-500 hover:bg-green-600">FREE</Badge>
                ) : (
                  <Badge className="bg-accent text-white px-3 py-1">₦{event.price.toLocaleString()}</Badge>
                )}
                {isClosingSoon() && <Badge variant="destructive">Closing Soon</Badge>}
                {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
              </div>
            </div>

            {/* Title + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{event.name}</h1>
                <div className="flex items-center gap-2 text-muted mt-2">
                  <User className="h-4 w-4" />
                  <span>By {event.organizer.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Details */}
            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-muted">{formatDate(event.date)} • {formatTime(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Venue</p>
                      <p className="text-muted">{event.location} • Gombe, Nigeria</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Attendance</p>
                      <p className="text-muted">
                        {event.attendees} registered • {availableSpots} spots left
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="font-semibold">Registration Closes</p>
                      <p className="text-muted">{formatDate(event.closingDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">About This Event</h2>
                <p className="text-muted leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking */}
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  {event.isFree ? (
                    <p className="text-2xl font-bold text-green-600">FREE</p>
                  ) : (
                    <p className="text-3xl font-bold">₦{event.price.toLocaleString()}</p>
                  )}
                  <p className="text-sm text-muted">Per ticket</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Available:</span>
                    <span>{availableSpots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Closes:</span>
                    <span>{new Date(event.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                <Link href={`/events/${event._id}/book`} className="block">
                  <Button className="w-full bg-accent hover:bg-accent/90" size="lg" disabled={isSoldOut}>
                    {isSoldOut ? "Sold Out" : event.isFree ? "Get Free Ticket" : "Book Ticket"}
                  </Button>
                </Link>
                {isClosingSoon() && <p className="text-xs text-red-500 text-center">⚠ Registration closes soon!</p>}
              </CardContent>
            </Card>

            {/* Organizer */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Organizer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-muted">Event Host</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
