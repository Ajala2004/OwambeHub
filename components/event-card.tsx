"use client"

import type { Event } from "@/types/event"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isClosingSoon = () => {
    const closingDate = new Date(event.closingDate)
    const now = new Date()
    const timeDiff = closingDate.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= 3 && daysDiff > 0
  }

  const isSoldOut = event.currentAttendees >= event.maxAttendees

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {event.isFree ? (
              <Badge className="bg-green-500 hover:bg-green-600">FREE</Badge>
            ) : (
              <Badge variant="secondary">${event.price}</Badge>
            )}
            {isClosingSoon() && <Badge variant="destructive">Closing Soon</Badge>}
            {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 text-balance">{event.name}</h3>
            <p className="text-muted text-sm mt-1 line-clamp-2">{event.description}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(event.date)} at {formatTime(event.date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-muted">
              <Users className="h-4 w-4" />
              <span>
                {event.currentAttendees}/{event.maxAttendees} attendees
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted">
              <Clock className="h-4 w-4" />
              <span>Registration closes {formatDate(event.closingDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link href={`/events/${event.id}`} className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            View Details
          </Button>
        </Link>
        <Link href={`/events/${event.id}/book`} className="flex-1">
          <Button className="w-full bg-accent hover:bg-accent/90" disabled={isSoldOut}>
            {isSoldOut ? "Sold Out" : event.isFree ? "Get Ticket" : "Book Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
