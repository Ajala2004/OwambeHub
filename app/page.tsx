"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp } from "lucide-react"

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

const categories = [
  "All",
  "Owambe",
  "Technology",
  "Business",
  "Music",
  "Food & Drinks",
  "Arts & Culture",
  "Sports",
  "Education",
  "Health",
  "Weddings",
  "Other",
]

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, searchQuery])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/events?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchEvents()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const convertedEvents = events.map((event) => ({
    id: event._id,
    name: event.name,
    description: event.description,
    date: event.date,
    closingDate: event.closingDate,
    price: event.price,
    isFree: event.isFree,
    location: event.location,
    category: event.category,
    image: event.imageUrl,
    maxAttendees: event.capacity,
    currentAttendees: event.attendees,
    organizer: event.organizer.name,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-card py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Find & Celebrate the Best Events in Nigeria  
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            From owambes in Lagos to weddings in Gombe, food festivals in Abuja, tech meetups in Yola,
            and concerts across Naija — OwambeHub helps you discover, book, and create unforgettable memories.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-5 w-5" />
              <Input
                placeholder="Search events, locations, or categories..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button size="lg" className="bg-accent hover:bg-accent/90 h-12 px-8" onClick={handleSearch}>
              <Filter className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 border-b border-border bg-card/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-medium text-muted whitespace-nowrap">Browse by:</span>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === selectedCategory ? "default" : "secondary"}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap px-4 py-1 text-sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-accent" />
                {selectedCategory === "All" ? "Trending Events" : `${selectedCategory} Events`}
              </h2>
              <p className="text-muted mt-2">
                {loading ? "Loading events..." : `${events.length} events available`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
              <p className="text-muted">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {convertedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-10">
            A Growing Community of Event Lovers Across Nigeria 🇳🇬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">10K+</div>
              <div className="text-muted">Events Hosted Nationwide</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">50K+</div>
              <div className="text-muted">Happy Attendees</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">500+</div>
              <div className="text-muted">Trusted Organizers & Hosts</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
