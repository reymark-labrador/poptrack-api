import { config } from "dotenv"
import mongoose from "mongoose"

// Load environment variables for testing
config({ path: ".env.test" })

// Set test environment
process.env.NODE_ENV = "test"

// Mock mongoose connection for tests
beforeAll(async () => {
  // Mock mongoose connection
  mongoose.connect = jest.fn().mockResolvedValue(undefined)
  mongoose.disconnect = jest.fn().mockResolvedValue(undefined)
})

afterAll(async () => {
  // Clean up mocks
  jest.clearAllMocks()
})
