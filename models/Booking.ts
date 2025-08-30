import mongoose, { type Document, Schema } from "mongoose"

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  quantity: number
  totalPrice: number
  paymentId: string
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  ticketIds: string[]
  bookingDate: Date
  status: "active" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    customerInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [10, "Maximum 10 tickets per booking"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    ticketIds: [
      {
        type: String,
        required: true,
      },
    ],
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for better query performance
BookingSchema.index({ eventId: 1, status: 1 })
BookingSchema.index({ "customerInfo.email": 1 })
BookingSchema.index({ paymentId: 1 })
BookingSchema.index({ ticketIds: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)
