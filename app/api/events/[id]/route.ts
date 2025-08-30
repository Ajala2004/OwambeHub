import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"
import mongoose from "mongoose"

// GET /api/events/[id] - Get single event for public
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

    // Only return active events to public
    if (event.status !== "active") {
      return NextResponse.json({ success: false, message: "Event not available" }, { status: 404 })
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
