const mongoose = require("mongoose")

const MONGODB_URI =
  "mongodb+srv://user:ajala2004.@cluster0.isudm.mongodb.net/emmaevent?retryWrites=true&w=majority&appName=Cluster0"

async function verifySetup() {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB successfully!")

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(
      "📊 Available collections:",
      collections.map((c) => c.name),
    )

    // Check events count
    const Event = mongoose.connection.db.collection("events")
    const eventCount = await Event.countDocuments()
    console.log(`📅 Events in database: ${eventCount}`)

    // Check admin user
    const Admin = mongoose.connection.db.collection("admins")
    const adminCount = await Admin.countDocuments()
    console.log(`👤 Admin users: ${adminCount}`)

    if (eventCount > 0 && adminCount > 0) {
      console.log("🎉 Setup complete! Your events platform is ready to use.")
      console.log('📝 Admin credentials: username="admin", password="admin"')
      console.log("🌐 Access admin panel at: /admin/login")
    } else {
      console.log("⚠️  Setup incomplete. Please run the seed script first.")
    }

    process.exit(0)
  } catch (error) {
    console.error("❌ Setup verification failed:", error)
    process.exit(1)
  }
}

verifySetup()
