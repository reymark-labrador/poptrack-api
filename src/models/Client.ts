import mongoose, { Document, Schema } from "mongoose"

export interface IClient extends Document {
  name: string
  email: string
  phone?: string
  viewings: mongoose.Types.ObjectId[]
  createdAt: Date
}

const clientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  viewings: [{ type: Schema.Types.ObjectId, ref: "Viewing" }],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IClient>("Client", clientSchema)
