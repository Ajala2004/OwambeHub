import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Event from "@/models/Event"
import Booking from "@/models/Booking"
import { generateTicketIds, generatePaymentId } from "@/lib/utils/ticket-generator"
import mongoose from "mongoose"

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["eventId", "customerInfo", "quantity"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, message: `${field} is required` }, { status: 400 })
      }
    }

    // Validate customer info
    const { firstName, lastName, email } = body.customerInfo
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ success: false, message: "Customer name and email are required" }, { status: 400 })
    }

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(body.eventId)) {
      return NextResponse.json({ success: false, message: "Invalid event ID" }, { status: 400 })
    }

    // Get event details
    const event = await Event.findById(body.eventId)
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    // Check if event is active and registration is open
    if (event.status !== "active") {
      return NextResponse.json({ success: false, message: "Event is not available for booking" }, { status: 400 })
    }

    const now = new Date()
    if (now > event.closingDate) {
      return NextResponse.json({ success: false, message: "Registration has closed for this event" }, { status: 400 })
    }

    // Check capacity
    const quantity = Number.parseInt(body.quantity)
    if (event.attendees + quantity > event.capacity) {
      return NextResponse.json({ success: false, message: "Not enough spots available" }, { status: 400 })
    }

    // Calculate total price
    const totalPrice = event.price * quantity

    // Generate ticket IDs and payment ID
    const ticketIds = generateTicketIds(quantity)
    const paymentId = generatePaymentId()

    // Create booking
    const booking = new Booking({
      eventId: body.eventId,
      customerInfo: {
        firstName,
        lastName,
        email,
        phone: body.customerInfo.phone || undefined,
      },
      quantity,
      totalPrice,
      paymentId,
      paymentStatus: totalPrice === 0 ? "completed" : "pending",
      ticketIds,
      status: "active",
    })

    // Start transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Save booking
      const savedBooking = await booking.save({ session })

      // Update event attendees count
      await Event.findByIdAndUpdate(body.eventId, { $inc: { attendees: quantity } }, { session })

      await session.commitTransaction()

      return NextResponse.json(
        {
          success: true,
          message: "Booking created successfully",
          booking: {
            _id: savedBooking._id,
            eventId: savedBooking.eventId,
            eventName: event.name,
            eventDate: event.date,
            eventLocation: event.location,
            customerInfo: savedBooking.customerInfo,
            quantity: savedBooking.quantity,
            totalPrice: savedBooking.totalPrice,
            paymentId: savedBooking.paymentId,
            paymentStatus: savedBooking.paymentStatus,
            ticketIds: savedBooking.ticketIds,
            bookingDate: savedBooking.bookingDate,
          },
        },
        { status: 201 },
      )
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  } catch (error: any) {
    console.error("Error creating booking:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Failed to create booking" }, { status: 500 })
  }
}
