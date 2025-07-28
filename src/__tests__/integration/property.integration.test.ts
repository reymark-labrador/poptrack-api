import request from "supertest"
import app from "../../app"
import Property from "../../models/Property"

// Mock the Property model
jest.mock("../../models/Property")
const MockedProperty = Property as any

// Mock the pagination utility
jest.mock("../../utils/pagination", () => ({
  createPaginatedResponse: jest.fn().mockImplementation((req) => {
    const page = parseInt(req.query?.page as string) || 1
    const limit = parseInt(req.query?.limit as string) || 10
    return Promise.resolve({
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    })
  }),
}))

// Mock mongoose errors
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  Error: {
    ...jest.requireActual("mongoose").Error,
    CastError: class CastError extends Error {
      constructor(message: string) {
        super(message)
        this.name = "CastError"
      }
    },
    ValidationError: class ValidationError extends Error {
      constructor(message: string) {
        super(message)
        this.name = "ValidationError"
      }
    },
  },
}))

describe("Property API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/properties", () => {
    it("should return properties list", async () => {
      const response = await request(app)
        .get("/api/properties")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body).toHaveProperty("data")
      expect(response.body).toHaveProperty("pagination")
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it("should handle query parameters", async () => {
      const response = await request(app)
        .get("/api/properties")
        .query({
          type: "sale",
          city: "London",
          minPrice: "100000",
          maxPrice: "500000",
        })
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body).toHaveProperty("data")
      expect(response.body).toHaveProperty("pagination")
    })

    it("should handle pagination parameters", async () => {
      const response = await request(app)
        .get("/api/properties")
        .query({
          page: "1",
          limit: "5",
        })
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body.pagination).toHaveProperty("page", 1)
      expect(response.body.pagination).toHaveProperty("limit", 5)
    })
  })

  describe("GET /api/properties/:id", () => {
    it("should return 400 for invalid ID format", async () => {
      // Mock findById to throw CastError
      const castError = new Error("CastError")
      castError.name = "CastError"
      MockedProperty.findById.mockRejectedValue(castError)
      await request(app).get("/api/properties/nonexistent-id").expect(400)
    })

    it("should return 400 for invalid ID format", async () => {
      // Mock findById to throw CastError
      const castError = new Error("CastError")
      castError.name = "CastError"
      MockedProperty.findById.mockRejectedValue(castError)
      await request(app).get("/api/properties/invalid-id-format").expect(400)
    })

    it("should return 404 for non-existent property with valid ID", async () => {
      // Mock findById to return null for a valid ObjectId
      MockedProperty.findById.mockResolvedValue(null)
      await request(app)
        .get("/api/properties/507f1f77bcf86cd799439011")
        .expect(404)
    })
  })

  describe("POST /api/properties", () => {
    it("should create a new property with valid data", async () => {
      const propertyData = {
        title: "Test Property",
        description: "A test property",
        price: 250000,
        type: "sale",
        bedrooms: 3,
        bathrooms: 2,
        location: {
          address: "123 Test Street",
          city: "London",
          coordinates: {
            lat: 51.5074,
            lng: -0.1278,
          },
        },
      }

      const mockProperty = {
        ...propertyData,
        _id: "507f1f77bcf86cd799439011",
        toObject: jest.fn().mockReturnValue({
          ...propertyData,
          _id: "507f1f77bcf86cd799439011",
        }),
      }

      MockedProperty.create.mockResolvedValue(mockProperty)

      const response = await request(app)
        .post("/api/properties")
        .send(propertyData)
        .expect("Content-Type", /json/)
        .expect(201)

      expect(response.body).toHaveProperty("_id")
      expect(response.body.title).toBe(propertyData.title)
      expect(response.body.price).toBe(propertyData.price)
    })

    it("should return 400 for invalid property data", async () => {
      const invalidData = {
        title: "", // Empty title
        price: -1000, // Negative price
        type: "sale", // Required field
        location: {
          city: "London", // Required field
        },
      }

      // Mock create to throw ValidationError
      const validationError = new Error("ValidationError")
      validationError.name = "ValidationError"
      MockedProperty.create.mockRejectedValue(validationError)
      await request(app).post("/api/properties").send(invalidData).expect(400)
    })

    it("should return 400 for invalid coordinates", async () => {
      const invalidData = {
        title: "Test Property",
        price: 250000,
        type: "sale",
        location: {
          city: "London",
          coordinates: {
            lat: 100, // Invalid latitude
            lng: -0.1278,
          },
        },
      }

      await request(app).post("/api/properties").send(invalidData).expect(400)
    })
  })

  describe("PUT /api/properties/:id", () => {
    it("should return 400 for invalid ID format", async () => {
      const updateData = {
        title: "Updated Property",
      }

      // Mock findByIdAndUpdate to throw CastError
      const castError = new Error("CastError")
      castError.name = "CastError"
      MockedProperty.findByIdAndUpdate.mockRejectedValue(castError)
      await request(app)
        .put("/api/properties/nonexistent-id")
        .send(updateData)
        .expect(400)
    })
  })

  describe("DELETE /api/properties/:id", () => {
    it("should return 400 for invalid ID format", async () => {
      // Mock findByIdAndDelete to throw CastError
      const castError = new Error("CastError")
      castError.name = "CastError"
      MockedProperty.findByIdAndDelete.mockRejectedValue(castError)
      await request(app).delete("/api/properties/nonexistent-id").expect(400)
    })
  })
})
