const mongoose = require("mongoose")

const MONGODB_URI =
  "mongodb+srv://user:ajala2004.@cluster0.isudm.mongodb.net/emmaevent?retryWrites=true&w=majority&appName=Cluster0"

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  endDate: Date,
  location: String,
  price: Number,
  isFree: Boolean,
  capacity: Number,
  attendees: Number,
  category: String,
  imageUrl: String,
  organizer: {
    name: String,
    email: String,
    phone: String,
  },
  ticketClosingDate: Date,
  status: String,
  createdAt: Date,
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  createdAt: Date,
})

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema)

const sampleEvents = [
  {
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year featuring AI, blockchain, and web development.",
    date: new Date("2024-12-15T09:00:00Z"),
    endDate: new Date("2024-12-15T18:00:00Z"),
    location: "Lagos Convention Center, Nigeria",
    price: 15000,
    isFree: false,
    capacity: 500,
    attendees: 234,
    category: "Technology",
    imageUrl: "/tech-conference-ai-artificial-intelligence.png",
    organizer: {
      name: "Tech Events Nigeria",
      email: "info@techevents.ng",
      phone: "+234-801-234-5678",
    },
    ticketClosingDate: new Date("2024-12-10T23:59:59Z"),
    status: "active",
    createdAt: new Date(),
  },
  {
    title: "Food Festival Lagos",
    description: "Experience the best of Nigerian cuisine with local and international chefs.",
    date: new Date("2024-12-20T12:00:00Z"),
    endDate: new Date("2024-12-20T22:00:00Z"),
    location: "Victoria Island, Lagos",
    price: 0,
    isFree: true,
    capacity: 1000,
    attendees: 567,
    category: "Food & Drink",
    imageUrl: "/food-festival-community-outdoor-dining.png",
    organizer: {
      name: "Lagos Food Council",
      email: "events@lagosfood.org",
      phone: "+234-802-345-6789",
    },
    ticketClosingDate: new Date("2024-12-18T23:59:59Z"),
    status: "active",
    createdAt: new Date(),
  },
  {
    title: "Digital Marketing Workshop",
    description: "Learn the latest digital marketing strategies and tools from industry experts.",
    date: new Date("2024-12-25T10:00:00Z"),
    endDate: new Date("2024-12-25T16:00:00Z"),
    location: "Ikeja Business Hub, Lagos",
    price: 8000,
    isFree: false,
    capacity: 100,
    attendees: 45,
    category: "Business",
    imageUrl: "/digital-marketing-workshop-business-training.png",
    organizer: {
      name: "Digital Skills Academy",
      email: "workshop@digitalskills.ng",
      phone: "+234-803-456-7890",
    },
    ticketClosingDate: new Date("2024-12-22T23:59:59Z"),
    status: "active",
    createdAt: new Date(),
  },
]

const adminUser = {
  username: "admin",
  password: "admin", // In production, this should be hashed
  role: "admin",
  createdAt: new Date(),
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await Event.deleteMany({})
    await Admin.deleteMany({})
    console.log("Cleared existing data")

    // Insert sample events
    await Event.insertMany(sampleEvents)
    console.log("Sample events inserted")

    // Insert admin user
    await Admin.create(adminUser)
    console.log("Admin user created")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
