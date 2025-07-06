import mongoose, { Document, Schema } from "mongoose"

export interface ILead extends Document {
  name: string
  email: string
  phone?: string
  message?: string
  property: mongoose.Types.ObjectId
  status: "new" | "contacted" | "converted" | "archived"
  convertedToClient?: mongoose.Types.ObjectId
  submittedAt: Date
}

const leadSchema = new Schema<ILead>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: String,
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  status: {
    type: String,
    enum: ["new", "contacted", "converted", "archived"],
    default: "new",
  },
  convertedToClient: { type: Schema.Types.ObjectId, ref: "Client" },
  submittedAt: { type: Date, default: Date.now },
})

export default mongoose.model<ILead>("Lead", leadSchema)
