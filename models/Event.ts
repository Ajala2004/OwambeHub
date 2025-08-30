import mongoose, { type Document, Schema } from "mongoose"

export interface IEvent extends Document {
  name: string
  description: string
  date: Date
  closingDate: Date
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
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      maxlength: [100, "Event name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Event date must be in the future",
      },
    },
    closingDate: {
      type: Date,
      required: [true, "Closing date is required"],
      validate: {
        validator: function (this: IEvent, value: Date) {
          return value <= this.date
        },
        message: "Closing date must be before or on the event date",
      },
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    isFree: {
      type: Boolean,
      default: function (this: IEvent) {
        return this.price === 0
      },
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technology", "Business", "Arts", "Sports", "Food", "Music", "Education", "Health", "Other"],
      default: "Other",
    },
    organizer: {
      name: {
        type: String,
        required: [true, "Organizer name is required"],
        trim: true,
        maxlength: [100, "Organizer name cannot exceed 100 characters"],
      },
      email: {
        type: String,
        required: [true, "Organizer email is required"],
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
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    attendees: {
      type: Number,
      default: 0,
      min: [0, "Attendees cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for available spots
EventSchema.virtual("availableSpots").get(function (this: IEvent) {
  return this.capacity - this.attendees
})

// Virtual for registration status
EventSchema.virtual("isRegistrationOpen").get(function (this: IEvent) {
  const now = new Date()
  return now <= this.closingDate && this.attendees < this.capacity && this.status === "active"
})

// Index for better query performance
EventSchema.index({ date: 1, status: 1 })
EventSchema.index({ category: 1, status: 1 })
EventSchema.index({ "organizer.email": 1 })

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)
