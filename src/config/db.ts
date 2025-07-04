import mongoose from "mongoose"

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI as string
    const dbName = process.env.DB_NAME as string

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is required")
    }

    if (!dbName) {
      throw new Error("DB_NAME environment variable is required")
    }

    // Construct connection string with database name
    const connectionString = `${mongoUri}/${dbName}`

    const conn = await mongoose.connect(connectionString)
    console.log(`MongoDB connected: ${conn.connection.host}`)
    console.log(`Database: ${dbName}`)
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1) // Exit process with failure
  }
}

export default connectDB
