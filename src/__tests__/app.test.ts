import request from "supertest"
import app from "../app"

describe("App", () => {
  describe("GET /", () => {
    it("should return API is running message", async () => {
      const response = await request(app).get("/")

      expect(response.status).toBe(200)
      expect(response.text).toBe("API is running")
    })
  })

  describe("API Routes", () => {
    it("should have properties route", async () => {
      const response = await request(app).get("/api/properties")

      // Should not return 404 (route exists)
      expect(response.status).not.toBe(404)
    })

    it("should have clients route", async () => {
      const response = await request(app).get("/api/clients")

      // Should not return 404 (route exists)
      expect(response.status).not.toBe(404)
    })

    it("should have viewings route", async () => {
      const response = await request(app).get("/api/viewings")

      // Should not return 404 (route exists)
      expect(response.status).not.toBe(404)
    })

    it("should have leads route", async () => {
      const response = await request(app).get("/api/leads")

      // Should not return 404 (route exists)
      expect(response.status).not.toBe(404)
    })

    it("should have frontend properties route", async () => {
      const response = await request(app).get("/api/frontend/properties")

      // Should not return 404 (route exists)
      expect(response.status).not.toBe(404)
    })
  })
})
