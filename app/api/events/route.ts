import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"

// GET /api/events - Get all active events for public
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")

    // Build query
    const query: any = {
      status: "active",
      date: { $gte: new Date() }, // Only future events
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get events with pagination
    const events = await Event.find(query)
      .sort({ date: 1 }) // Sort by date ascending (nearest first)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Event.countDocuments(query)

    return NextResponse.json({
      success: true,
      events: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 })
  }
}
