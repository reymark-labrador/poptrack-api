import "./config/env"
import app from "./app"

import connectDB from "./config/db"
import { setupSwagger } from "./config/swagger"

const PORT = process.env.PORT || 3000

const startServer = async () => {
  await connectDB()

  setupSwagger(app)
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
