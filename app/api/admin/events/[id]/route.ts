import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"
import mongoose from "mongoose"

// GET /api/admin/events/[id] - Get single event for admin
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: "Invalid event ID" }, { status: 400 })
    }

    const event = await Event.findById(params.id).lean()

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      event: event,
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch event" }, { status: 500 })
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: "Invalid event ID" }, { status: 400 })
    }

    const body = await request.json()

    // Validate dates if provided
    if (body.date && body.closingDate) {
      const eventDate = new Date(body.date)
      const closingDate = new Date(body.closingDate)

      if (closingDate > eventDate) {
        return NextResponse.json(
          { success: false, message: "Closing date must be before or on the event date" },
          { status: 400 },
        )
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (body.name) updateData.name = body.name
    if (body.description) updateData.description = body.description
    if (body.date) updateData.date = new Date(body.date)
    if (body.closingDate) updateData.closingDate = new Date(body.closingDate)
    if (body.location) updateData.location = body.location
    if (body.price !== undefined) {
      updateData.price = Number(body.price)
      updateData.isFree = Number(body.price) === 0
    }
    if (body.imageUrl) updateData.imageUrl = body.imageUrl
    if (body.category) updateData.category = body.category
    if (body.capacity) updateData.capacity = Number(body.capacity)
    if (body.status) updateData.status = body.status

    if (body.organizer) {
      updateData.organizer = {
        name: body.organizer.name,
        email: body.organizer.email,
        phone: body.organizer.phone || undefined,
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    })
  } catch (error: any) {
    console.error("Error updating event:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Failed to update event" }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: "Invalid event ID" }, { status: 400 })
    }

    const deletedEvent = await Event.findByIdAndDelete(params.id)

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ success: false, message: "Failed to delete event" }, { status: 500 })
  }
}
