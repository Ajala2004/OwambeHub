"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Search, Ticket, User } from "lucide-react"
import Link from "next/link"

interface TicketInfo {
  id: string
  eventName: string
  eventDate: string
  eventLocation: string
  ticketNumber: number
  totalTickets: number
  status: "upcoming" | "past" | "cancelled"
  price: number
  isFree: boolean
}

// Mock data - in a real app, this would come from a database
const mockTickets: TicketInfo[] = [
  {
    id: "ticket_1234567890_1_abc123",
    eventName: "Tech Conference 2024: Future of AI",
    eventDate: "2024-03-15T09:00:00Z",
    eventLocation: "San Francisco Convention Center, CA",
    ticketNumber: 1,
    totalTickets: 2,
    status: "upcoming",
    price: 299,
    isFree: false,
  },
  {
    id: "ticket_1234567891_1_def456",
    eventName: "Community Food Festival",
    eventDate: "2024-03-20T11:00:00Z",
    eventLocation: "Central Park, New York, NY",
    ticketNumber: 1,
    totalTickets: 1,
    status: "upcoming",
    price: 0,
    isFree: true,
  },
  {
    id: "ticket_1234567892_1_ghi789",
    eventName: "Digital Marketing Workshop",
    eventDate: "2024-02-10T14:00:00Z",
    eventLocation: "Online Event",
    ticketNumber: 1,
    totalTickets: 1,
    status: "past",
    price: 149,
    isFree: false,
  },
]

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTickets(mockTickets)
  }, [])

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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.eventLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || ticket.status === filter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-500 hover:bg-green-600">Upcoming</Badge>
      case "past":
        return <Badge variant="secondary">Past Event</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Ticket className="h-8 w-8 text-accent" />
            My Tickets
          </h1>
          <p className="text-muted">Manage and view all your event tickets in one place.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-4 w-4" />
            <Input
              placeholder="Search events or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
              All
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              onClick={() => setFilter("upcoming")}
              size="sm"
            >
              Upcoming
            </Button>
            <Button variant={filter === "past" ? "default" : "outline"} onClick={() => setFilter("past")} size="sm">
              Past
            </Button>
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="h-16 w-16 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Tickets Found</h2>
            <p className="text-muted mb-6">
              {searchTerm || filter !== "all"
                ? "No tickets match your search criteria."
                : "You haven't booked any events yet."}
            </p>
            <Link href="/">
              <Button>Browse Events</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 text-balance">{ticket.eventName}</CardTitle>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(ticket.eventDate)} at {formatTime(ticket.eventDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{ticket.eventLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted">
                      <User className="h-4 w-4" />
                      <span>
                        Ticket {ticket.ticketNumber} of {ticket.totalTickets}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm">
                      {ticket.isFree ? (
                        <Badge className="bg-green-500 hover:bg-green-600">FREE</Badge>
                      ) : (
                        <span className="font-semibold text-foreground">${ticket.price}</span>
                      )}
                    </div>

                    <Link href={`/tickets/${ticket.id}`}>
                      <Button size="sm" variant="outline">
                        View Ticket
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {tickets.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{tickets.length}</div>
                <div className="text-sm text-muted">Total Tickets</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {tickets.filter((t) => t.status === "upcoming").length}
                </div>
                <div className="text-sm text-muted">Upcoming Events</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {tickets.filter((t) => t.status === "past").length}
                </div>
                <div className="text-sm text-muted">Past Events</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
