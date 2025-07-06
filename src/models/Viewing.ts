import mongoose, { Document, Schema } from "mongoose"

export interface IViewing extends Document {
  client: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  scheduledAt: Date
  status: "scheduled" | "completed" | "no-show"
  notes?: string
  createdAt: Date
}

const viewingSchema = new Schema<IViewing>({
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "no-show"],
    default: "scheduled",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IViewing>("Viewing", viewingSchema)
