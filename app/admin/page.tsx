"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  LogOut,
} from "lucide-react"
import Link from "next/link"

interface Event {
  _id: string
  name: string
  description: string
  date: string
  closingDate: string
  location: string
  price: number
  isFree: boolean
  imageUrl: string
  category: string
  organizer: {
    name: string
    email: string
    phone?: string
  }
  capacity: number
  attendees: number
  status: "active" | "cancelled" | "completed"
  availableSpots: number
  isRegistrationOpen: boolean
}

interface EventFormData {
  name: string
  description: string
  date: string
  closingDate: string
  location: string
  price: string
  imageUrl: string
  category: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  capacity: string
}

const initialFormData: EventFormData = {
  name: "",
  description: "",
  date: "",
  closingDate: "",
  location: "",
  price: "0",
  imageUrl: "",
  category: "Other",
  organizerName: "",
  organizerEmail: "",
  organizerPhone: "",
  capacity: "100",
}

const categories = ["Technology", "Business", "Arts", "Sports", "Food", "Music", "Education", "Health", "Other"]

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/admin/check-auth")
      if (response.ok) {
        setIsAuthenticated(true)
        fetchEvents()
      } else {
        router.push("/admin/login")
      }
    } catch {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        closingDate: new Date(formData.closingDate).toISOString(),
        location: formData.location,
        price: Number.parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          phone: formData.organizerPhone || undefined,
        },
        capacity: Number.parseInt(formData.capacity),
      }

      const url = editingEvent ? `/api/admin/events/${editingEvent._id}` : "/api/admin/events"
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingEvent ? "Event updated successfully!" : "Event created successfully!",
        })
        setFormData(initialFormData)
        setShowAddForm(false)
        setEditingEvent(null)
        fetchEvents()
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to save event" })
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while saving the event" })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      closingDate: new Date(event.closingDate).toISOString().slice(0, 16),
      location: event.location,
      price: event.price.toString(),
      imageUrl: event.imageUrl,
      category: event.category,
      organizerName: event.organizer.name,
      organizerEmail: event.organizer.email,
      organizerPhone: event.organizer.phone || "",
      capacity: event.capacity.toString(),
    })
    setShowAddForm(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" })
      if (response.ok) {
        setMessage({ type: "success", text: "Event deleted successfully!" })
        fetchEvents()
      } else {
        setMessage({ type: "error", text: "Failed to delete event" })
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred while deleting the event" })
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingEvent(null)
    setFormData(initialFormData)
    setMessage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Management Dashboard</h1>
            <p className="text-muted mt-2">Manage events, track attendees, and organize everything in one place.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2" disabled={showAddForm}>
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <Alert className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-10 border border-dashed shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingEvent ? " Edit Event" : "➕ Create Event"}
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea id="description" rows={4} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input id="date" type="datetime-local" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="closingDate">Closing Date *</Label>
                    <Input id="closingDate" type="datetime-local" value={formData.closingDate} onChange={(e) => handleInputChange("closingDate", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => handleInputChange("capacity", e.target.value)} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input id="imageUrl" type="url" value={formData.imageUrl} onChange={(e) => handleInputChange("imageUrl", e.target.value)} required />
                  </div>
                </div>

                <Separator />

                {/* Organizer Info */}
                <div>
                  <h3 className="text-lg font-semibold">Organizer Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <Label htmlFor="organizerName">Name *</Label>
                      <Input id="organizerName" value={formData.organizerName} onChange={(e) => handleInputChange("organizerName", e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="organizerEmail">Email *</Label>
                      <Input id="organizerEmail" type="email" value={formData.organizerEmail} onChange={(e) => handleInputChange("organizerEmail", e.target.value)} required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="organizerPhone">Phone</Label>
                      <Input id="organizerPhone" type="tel" value={formData.organizerPhone} onChange={(e) => handleInputChange("organizerPhone", e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events Grid */}
        <h2 className="text-2xl font-bold mb-6"> All Events ({events.length})</h2>
        {events.length === 0 ? (
          <Card className="p-10 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted mb-4" />
            <p className="text-muted mb-2">No events found. Start by creating one!</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden shadow-md">
                <div className="aspect-video relative">
                  <img src={event.imageUrl || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <Badge variant="outline" className="mt-1">{event.category}</Badge>
                  <div className="mt-3 space-y-2 text-sm text-muted">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.attendees}/{event.capacity}</div>
                    <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {event.isFree ? "Free" : `$${event.price}`}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Link href={`/events/${event._id}`}><Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> View</Button></Link>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(event)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(event._id)} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
