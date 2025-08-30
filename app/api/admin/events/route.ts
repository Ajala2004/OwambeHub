import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"

// GET /api/admin/events - Get all events for admin
export async function GET() {
  try {
    await connectDB()

    const events = await Event.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      events: events,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/admin/events - Create new event
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "date",
      "closingDate",
      "location",
      "price",
      "imageUrl",
      "category",
      "organizer",
      "capacity",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `${field} is required` }, { status: 400 })
      }
    }

    // Validate organizer object
    if (!body.organizer.name || !body.organizer.email) {
      return NextResponse.json({ success: false, message: "Organizer name and email are required" }, { status: 400 })
    }

    // Validate dates
    const eventDate = new Date(body.date)
    const closingDate = new Date(body.closingDate)
    const now = new Date()

    if (eventDate <= now) {
      return NextResponse.json({ success: false, message: "Event date must be in the future" }, { status: 400 })
    }

    if (closingDate > eventDate) {
      return NextResponse.json(
        { success: false, message: "Closing date must be before or on the event date" },
        { status: 400 },
      )
    }

    // Create new event
    const event = new Event({
      name: body.name,
      description: body.description,
      date: eventDate,
      closingDate: closingDate,
      location: body.location,
      price: Number(body.price),
      isFree: Number(body.price) === 0,
      imageUrl: body.imageUrl,
      category: body.category,
      organizer: {
        name: body.organizer.name,
        email: body.organizer.email,
        phone: body.organizer.phone || undefined,
      },
      capacity: Number(body.capacity),
      attendees: 0,
      status: "active",
    })

    const savedEvent = await event.save()

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event: savedEvent,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating event:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Failed to create event" }, { status: 500 })
  }
}
