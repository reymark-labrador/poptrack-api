import mongoose, { Document, Schema } from "mongoose"

export interface IProperty extends Document {
  title: string
  description?: string
  price: number
  type: "apartment" | "house" | "villa" | "commercial"
  location: {
    address?: string
    city: string
    state?: string
    country?: string
    coordinates?: { lat: number; lng: number }
  }
  amenities: string[]
  images: string[]
  bedrooms?: number
  bathrooms?: number
  area?: number
  createdAt: Date
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["apartment", "house", "villa", "commercial"],
    required: true,
  },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  amenities: [String],
  images: [String],
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IProperty>("Property", propertySchema)
