import mongoose, { Document, Schema } from "mongoose"

export interface IProperty extends Document {
  title: string
  description?: string
  price: number
  type: "sale" | "rent"
  location: {
    address?: string
    city: string
    state?: string
    country?: string
    coordinates?: [number, number] // [longitude, latitude] for MongoDB 2dsphere
  }
  amenities: string[]
  images: string[]
  bedrooms?: number
  bathrooms?: number
  area?: number
  createdAt: Date
  archived?: boolean
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["sale", "rent"],
    required: true,
  },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude] array
      validate: {
        validator: function (coords: number[]) {
          return (
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 && // longitude
            coords[1] >= -90 &&
            coords[1] <= 90
          ) // latitude
        },
        message: "Coordinates must be [longitude, latitude] with valid ranges",
      },
    },
  },
  amenities: [String],
  images: [String],
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  createdAt: { type: Date, default: Date.now },
  archived: { type: Boolean, default: false },
})

// Performance Indexes for Property Search
// These indexes are optimized for the most common query patterns

// 1. Single field indexes for basic filters
propertySchema.index({ type: 1 })
propertySchema.index({ price: 1 })
propertySchema.index({ bedrooms: 1 })
propertySchema.index({ bathrooms: 1 })
propertySchema.index({ createdAt: -1 }) // For sorting by newest

// 2. Location indexes for city/address search
propertySchema.index({ "location.city": 1 })
propertySchema.index({ "location.address": 1 })

// 3. Compound indexes for common filter combinations
// Most common: type + price range
propertySchema.index({ type: 1, price: 1 })

// Location + price (very common combination)
propertySchema.index({ "location.city": 1, price: 1 })

// Bedrooms + bathrooms + price (common filter combo)
propertySchema.index({ bedrooms: 1, bathrooms: 1, price: 1 })

// Type + location + price (comprehensive search)
propertySchema.index({ type: 1, "location.city": 1, price: 1 })

// 4. Text index for full-text search (optional enhancement)
propertySchema.index(
  {
    title: "text",
    description: "text",
    "location.city": "text",
    "location.address": "text",
  },
  {
    weights: {
      title: 10,
      "location.city": 8,
      "location.address": 6,
      description: 3,
    },
  }
)

// 5. Geospatial index (for future location-based search)
propertySchema.index({ "location.coordinates": "2dsphere" })

// 6. Array index for amenities search
propertySchema.index({ amenities: 1 })

// 7. Compound index for pagination with sorting
propertySchema.index({ createdAt: -1, _id: 1 })

export default mongoose.model<IProperty>("Property", propertySchema)
