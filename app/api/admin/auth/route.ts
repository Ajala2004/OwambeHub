// import { type NextRequest, NextResponse } from "next/server"
// import connectDB from "@/lib/mongodb"
// import Admin from "@/models/Admin"
// import bcrypt from "bcryptjs"

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB()

//     const { username, password } = await request.json()

//     if (!username || !password) {
//       return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
//     }

//     const admin = await Admin.findOne({ username })

//     if (!admin) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password)

//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//     }

//     // In production, use proper JWT tokens
//     const response = NextResponse.json(
//       { message: "Login successful", admin: { username: admin.username, role: admin.role } },
//       { status: 200 },
//     )

//     // Set a simple session cookie
//     response.cookies.set("admin-session", "authenticated", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     })

//     return response
//   } catch (error) {
//     console.error("Admin auth error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Admin from "@/models/Admin"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // ✅ Ensure a default admin exists
    const existingAdmin = await Admin.findOne({ username: "admin" })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin", 10)
      await Admin.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      })
      console.log("✅ Default admin created: username=admin, password=admin")
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const admin = await Admin.findOne({ username })

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In production, use proper JWT tokens
    const response = NextResponse.json(
      { message: "Login successful", admin: { username: admin.username, role: admin.role } },
      { status: 200 },
    )

    // Set a simple session cookie
    response.cookies.set("admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
