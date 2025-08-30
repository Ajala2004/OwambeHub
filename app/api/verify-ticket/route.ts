import { type NextRequest, NextResponse } from "next/server"

interface VerificationRequest {
  ticketId: string
  eventId: string
}

interface VerificationResponse {
  valid: boolean
  ticket?: {
    id: string
    eventName: string
    eventDate: string
    holderName: string
    ticketNumber: number
    status: "valid" | "used" | "expired" | "invalid"
  }
  error?: string
}

// Mock ticket verification - in a real app, this would check against a database
export async function POST(request: NextRequest): Promise<NextResponse<VerificationResponse>> {
  try {
    const body: VerificationRequest = await request.json()

    if (!body.ticketId || !body.eventId) {
      return NextResponse.json({ valid: false, error: "Missing ticket ID or event ID" }, { status: 400 })
    }

    // Simulate database lookup
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock validation logic
    const isValidFormat = body.ticketId.startsWith("ticket_") && body.eventId.length > 0
    const isNotExpired = true // In real app, check event date
    const isNotUsed = Math.random() > 0.1 // 90% chance ticket hasn't been used

    if (!isValidFormat) {
      return NextResponse.json({
        valid: false,
        error: "Invalid ticket format",
      })
    }

    if (!isNotExpired) {
      return NextResponse.json({
        valid: false,
        ticket: {
          id: body.ticketId,
          eventName: "Sample Event",
          eventDate: "2024-03-15T09:00:00Z",
          holderName: "John Doe",
          ticketNumber: 1,
          status: "expired",
        },
      })
    }

    if (!isNotUsed) {
      return NextResponse.json({
        valid: false,
        ticket: {
          id: body.ticketId,
          eventName: "Sample Event",
          eventDate: "2024-03-15T09:00:00Z",
          holderName: "John Doe",
          ticketNumber: 1,
          status: "used",
        },
      })
    }

    // Valid ticket
    return NextResponse.json({
      valid: true,
      ticket: {
        id: body.ticketId,
        eventName: "Sample Event",
        eventDate: "2024-03-15T09:00:00Z",
        holderName: "John Doe",
        ticketNumber: 1,
        status: "valid",
      },
    })
  } catch (error) {
    console.error("Ticket verification error:", error)
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 })
  }
}
